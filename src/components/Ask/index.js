import React, { Component } from "react";
import styles from "./index.less";

class Ask extends Component {
  render() {
    let { text, Askstyle } = this.props;
    return (
      <div className={styles.wrap} style={Askstyle.wrap.style}>
        <div className={styles.content} style={Askstyle.wrap.content.style}>
          {text}
        </div>
        <img
          className={styles.portrait}
          style={Askstyle.wrap.portrait.style}
          src="https://s2.ax1x.com/2020/01/07/l6Hw7R.png"
        ></img>
      </div>
    );
  }
}

export default Ask;
