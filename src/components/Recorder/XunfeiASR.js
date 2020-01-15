import hmacSHA256 from 'crypto-js/hmac-sha256';
import Base64 from 'crypto-js/enc-base64';
import Utf8 from 'crypto-js/enc-utf8';

const config = {
    host: 'iat-api.xfyun.cn',
    uri: '/v2/iat',
};

// 帧定义
const FRAME = {
    STATUS_FIRST_FRAME: 0,
    STATUS_CONTINUE_FRAME: 1,
    STATUS_LAST_FRAME: 2,
};

export default class {
    constructor(appId, apiKey, apiSecret) {
        this.appId = appId;
        this.apiKey = apiKey;
        this.apiSecret = apiSecret;
        this.sampleRate = 16000;
        this.sampleDepth = 16;
        this.timeoutSeconds = 2;

        this.results = [];
        this.status = FRAME.STATUS_FIRST_FRAME;
        this.socket = null;
        this.timeout = null;
        this.timeoutHandler = null;
    }

    // open connection with asr server
    openConnection = ({ onConnectionSuccess, onConnectionError, onProgress, onComplete }) => {
        this.results = [];
        this.status = FRAME.STATUS_FIRST_FRAME;
        const date = new Date().toUTCString();
        const signature_origin = `host: ${config.host}\ndate: ${date}\nGET ${config.uri} HTTP/1.1`;
        const signature = Base64.stringify(hmacSHA256(signature_origin, this.apiSecret));
        const authorization_origin = `api_key="${this.apiKey}", algorithm="hmac-sha256", headers="host date request-line", signature="${signature}"`;
        const authorization = Base64.stringify(Utf8.parse(authorization_origin));
        this.socket = new WebSocket(
            `wss://${config.host}${config.uri}?authorization=${authorization}&date=${date}&host=${config.host}`,
        );
        this.socket.addEventListener('open', event => {
            console.log('websocket connect!');
            onConnectionSuccess();
        });
        this.socket.addEventListener('message', (data, err) => {
            if (err) {
                onConnectionError(res);
                return;
            }
            console.log(data.data);
            const res = JSON.parse(data.data);
            console.log('Message from server ', res);
            if (res.code != 0) {
                onConnectionError(res);
                return;
            }
            this.handleReceivedResult(res.data, onProgress);
        });
        this.socket.addEventListener('error', event => {
            onComplete(this.mergeResult());
        });
        this.socket.addEventListener('close', event => {
            onComplete(this.mergeResult());
        });
        this.timeoutHandler = onComplete;
    };

    handleReceivedResult = (data, onProgress) => {
        this.resetTimeout();
        this.results[data.result.sn] = data.result;
        if (data.result.pgs == 'rpl') {
            // 动态修正
            data.result.rg.forEach(i => (this.results[i] = null));
        }
        // const text = data.cn.st.rt.map(x=>x.ws.map(y=>y.cw.map(z=>z.w).join('')).join('')).join('');
        // const bg = data.cn.st.bg;
        // const ed = data.cn.st.ed;
        // this.results.push({ text, bg, ed });

        const res = this.mergeResult();
        onProgress(res);
        this.resetTimeout();
        // console.log(text);
    };

    mergeResult = () => {
        return this.results
            .filter(i => i != null)
            .flatMap(i => i.ws.flatMap(j => j.cw.map(k => k.w)))
            .join('');
        // const res = Object.values(this.results.reduce((all, cur) => {
        //   if (!(cur.bg in all) || all[cur.bg].ed < cur.ed) {
        //     all[cur.bg] = cur;
        //   }
        //   return all;
        // }, {}));
        // return res.sort((a, b) => a.bg - b.bg).map(x=>x.text).join('');
    };

    onAudioProcess = e => {
        const inputSampleRate = e.inputBuffer.sampleRate;
        const data = e.inputBuffer.getChannelData(0);

        // compress to 16k sample rate
        let compression = parseInt(inputSampleRate / this.sampleRate);
        let length = data.length / compression;
        let bytes = new Float32Array(length);
        let index = 0,
            j = 0;
        while (index < length) {
            bytes[index] = data[j];
            j += compression;
            index++;
        }
        let dataLength = bytes.length * (this.sampleDepth / 8);

        // to 16bit
        let buffer = new ArrayBuffer(dataLength);
        let view = new DataView(buffer);
        let offset = 0;

        for (let i = 0; i < bytes.length; i++, offset += 2) {
            let s = Math.max(-1, Math.min(1, bytes[i]));
            view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7fff, true);
        }

        const dataBase64 = btoa(String.fromCharCode(...new Uint8Array(buffer)));
        this.send(dataBase64);
        // const blob = new Blob([view], { type: 'audio/pcm' });
        // this.socket.send(blob);
    };

    send = data => {
        if (!this.socket) {
            return;
        }
        let frame = '';
        let frameDataSection = {
            status: this.status,
            format: 'audio/L16;rate=16000',
            audio: data,
            encoding: 'raw',
        };
        switch (this.status) {
            case FRAME.STATUS_FIRST_FRAME:
                frame = {
                    common: { app_id: this.appId },
                    business: { language: 'zh_cn', domain: 'iat', accent: 'mandarin', dwa: 'wpgs' },
                    data: frameDataSection,
                };
                this.status = FRAME.STATUS_CONTINUE_FRAME;
                break;
            case FRAME.STATUS_CONTINUE_FRAME:
            case FRAME.STATUS_LAST_FRAME:
                //填充frame
                frame = { data: frameDataSection };
                break;
            default:
                break;
        }
        this.socket.send(JSON.stringify(frame));
    };

    stop = () => {
        if (this.socket) {
            // const blob = new Blob(['{"end": true}'], { type: 'application/json' });
            this.status = FRAME.STATUS_LAST_FRAME;
            this.send('');
        }
        this.socket = null;
    };

    resetTimeout = () => {
        if (this.timeout) {
            clearTimeout(this.timeout);
        }
        this.timeout = setTimeout(
            () => this.timeoutHandler(this.mergeResult()),
            this.timeoutSeconds * 1000,
        );
    };
}
