# hlzsreactlibrarydemo

>

[![NPM](https://img.shields.io/npm/v/hlzsreactlibrarydemo.svg)](https://www.npmjs.com/package/hlzsreactlibrarydemo) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

```bash
npm install --save hlzsreactlibrarydemo
```

## Usage

```jsx
import React, { Component } from "react";
import ExampleComponent from "hlzsreactlibrarydemo";
import config from "./config";

export default class App extends Component {
  render() {
    return (
      <div>
        <ExampleComponent config={config} />
      </div>
    );
  }
}
```

## config

```
github:https://github.com/chaiyongsheng0/hlzsreactlibrarydemo-config.git

USE:
src/
  index.js/
  config.js/
  config/

```

### config.js

- text：标题
- API_URL_BASE：服务器地址
- BOT_NAME：机器人名字
- Code [Object]
  - type：类型 <---①
  - code：代码 
- answertype: type--->① 对应 type 类型的代码会被引入，覆盖组件中的 Answer 组件
- styleconfig [Object] 样式:"属性" jsx 语法，对应的样式会被添加到行内

## License

MIT © [chaiyongsheng0](https://github.com/chaiyongsheng0)
