import React, { Component } from 'react';
import styles from './index.less';

class Answer extends Component {
    render() {
        let { text,Answerstyle } = this.props;
        return (
            <div className={styles.wrap} style={Answerstyle.wrap.style}>
                <img className={styles.portrait} style={Answerstyle.wrap.portrait.style}src='https://s2.ax1x.com/2020/01/07/l6Hw7R.png'></img>
                <div className={styles.content} style={Answerstyle.wrap.content.style}>{text}</div>
            </div>
        );
    }
}

export default Answer;