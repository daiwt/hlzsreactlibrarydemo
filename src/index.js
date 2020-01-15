import React, { Component } from "react";
import styles from "./styles.less";
import services from "./services/services";
import { Ask, Answer, Recorder } from "./components";

class ExampleComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dialog: [],
      modelshow: false,
      dialogueshow: true,
      dragboolean: false,
      login: {},
      msg: {},
      diffX: 0,
      diffY: 0,
      endLeft: "",
      endTop: "",
      maxTop: "",
      maxLeft: "",
      containercursor: "default",
      endWidth: "",
      endHeight: "",
      positionMousedown: false,
      positionData: {},
      L: false,
      R: false,
      T: false,
      B: false,
      lineHeight: ""
    };
  }
  componentDidMount() {
    const { API_URL_BASE, BOT_NAME } = this.props.config;
    const { openSession } = services.main;
    openSession(API_URL_BASE, BOT_NAME)
      .then(data => {
        this.setState({
          login: data
        });
      })
      .catch(err => console.log("error", err));
    if (this.state.dialogueshow) {
      let dialogue = document.getElementsByClassName("styles_wrap__33ZSE");
      const lineHeight = dialogue[0].childNodes[0].offsetHeight;
      this.setState({
        lineHeight: lineHeight
      });
    }
    document.addEventListener("mousedown", this.onMousedown);
    document.addEventListener("mousemove", this.onMousemove);
    document.addEventListener("mouseup", ev => {
      this.setState({
        positionMousedown: false,
        L: false,
        R: false,
        T: false,
        B: false
      });
    });
  }
  evPosition = (ev, L, R, T, B) => {
    let dialogue = document.getElementsByClassName("styles_wrap__33ZSE");
    L =
      ev.pageX >= dialogue[0].parentElement.offsetLeft &&
      ev.pageX <= dialogue[0].parentElement.offsetLeft + 5 &&
      ev.pageY >= dialogue[0].parentElement.offsetTop &&
      ev.pageY <=
        dialogue[0].parentElement.offsetTop + dialogue[0].clientHeight;
    R =
      ev.pageX >=
        dialogue[0].parentElement.offsetLeft - 2 + dialogue[0].clientWidth &&
      ev.pageX <=
        dialogue[0].parentElement.offsetLeft + dialogue[0].clientWidth &&
      ev.pageY >= dialogue[0].parentElement.offsetTop &&
      ev.pageY <=
        dialogue[0].parentElement.offsetTop + dialogue[0].clientHeight;
    T =
      ev.pageY >= dialogue[0].parentElement.offsetTop &&
      ev.pageY <= dialogue[0].parentElement.offsetTop + 5 &&
      ev.pageX >= dialogue[0].parentElement.offsetLeft &&
      ev.pageX <=
        dialogue[0].parentElement.offsetLeft + dialogue[0].clientWidth;
    B =
      ev.pageY >=
        dialogue[0].parentElement.offsetTop - 5 + dialogue[0].clientHeight &&
      ev.pageY <=
        dialogue[0].parentElement.offsetTop + dialogue[0].clientHeight &&
      ev.pageX >= dialogue[0].parentElement.offsetLeft &&
      ev.pageX <=
        dialogue[0].parentElement.offsetLeft + dialogue[0].clientWidth;
    return { L, R, T, B };
  };
  onMousedown = ev => {
    if (this.state.dialogueshow) {
      let dialogue = document.getElementsByClassName("styles_wrap__33ZSE");
      let { L, R, T, B } = this.evPosition(ev, L, R, T, B);
      if (L || R || T || B) {
        let startX = ev.pageX,
          startY = ev.pageY,
          startLeft = dialogue[0].parentElement.offsetLeft,
          startTop = dialogue[0].parentElement.offsetTop,
          startWidth = dialogue[0].parentElement.offsetWidth,
          startHeight = dialogue[0].parentElement.offsetHeight;
        this.setState({
          positionMousedown: true,
          positionData: {
            startX,
            startY,
            startLeft,
            startTop,
            startWidth,
            startHeight
          }
        });
      }
      if (L) {
        this.setState({
          L: true
        });
      }
      if (R) {
        this.setState({
          R: true
        });
      }
      if (T) {
        this.setState({
          T: true
        });
      }
      if (B) {
        this.setState({
          B: true
        });
      }
    }
  };
  onMousemove = ev => {
    if (this.state.dialogueshow) {
      let dialogue = document.getElementsByClassName("styles_wrap__33ZSE");
      const lineHeight = dialogue[0].childNodes[0].offsetHeight;
      let { L, R, T, B } = this.evPosition(ev, L, R, T, B);
      if (L || R || T || B) {
        if (!((L || R) && (T || B))) {
          if (L) {
            this.setState({
              containercursor: "w-resize"
            });
          } else if (R) {
            this.setState({
              containercursor: "e-resize"
            });
          } else if (T) {
            this.setState({
              containercursor: "n-resize"
            });
          } else if (B) {
            this.setState({
              containercursor: "s-resize"
            });
          }
        } else if (L && T) {
          this.setState({
            containercursor: "nw-resize"
          });
        } else if (R && T) {
          this.setState({
            containercursor: "ne-resize"
          });
        } else if (L && B) {
          this.setState({
            containercursor: "sw-resize"
          });
        } else if (R && B) {
          this.setState({
            containercursor: "se-resize"
          });
        }
      } else if (!(this.state.containercursor == "default")) {
        this.setState({
          containercursor: "default"
        });
      }
      if (this.state.positionMousedown) {
        let {
          startX,
          startY,
          startLeft,
          startTop,
          startWidth,
          startHeight
        } = this.state.positionData;

        let { L, R, T, B } = this.state;
        let diffX = ev.pageX - startX,
          diffY = ev.pageY - startY;
        if (L) {
          let endWidth = startWidth - diffX;
          endWidth < 420 ? (endWidth = 420) : null;
          diffX = startWidth - endWidth - 5;
          let endLeft = startLeft + diffX;
          this.setState({
            endLeft: endLeft,
            endWidth: endWidth
          });
        }
        if (R) {
          let endWidth = startWidth + diffX;
          endWidth < 420 ? (endWidth = 420) : null;
          this.setState({
            endWidth: endWidth
          });
        }
        if (T) {
          diffY < -startTop ? (diffY = -startTop) : null;
          let endHeight = startHeight - diffY;
          endHeight < 430 ? (endHeight = 430) : null;
          diffY = startHeight - endHeight;
          let endTop = startTop + diffY;
          endTop < 0 ? (endTop = 0) : null;
          this.setState({
            endTop: endTop - 5,
            endHeight: endHeight,
            lineHeight: lineHeight
          });
        }
        if (B) {
          let endHeight = startHeight + diffY;
          endHeight > document.documentElement.clientHeight - startTop
            ? (endHeight = document.documentElement.clientHeight - startTop)
            : endHeight < 430
            ? (endHeight = 430)
            : null;
          this.setState({
            endHeight: endHeight,
            lineHeight: lineHeight
          });
        }
      }
    }
  };
  mouseDown = ev => {
    let dialogue = document.getElementsByClassName("styles_wrap__33ZSE"),
      T =
        ev.pageY >= dialogue[0].offsetParent.offsetTop &&
        ev.pageY <= dialogue[0].offsetParent.offsetTop + 5 &&
        ev.pageX >= dialogue[0].offsetParent.offsetLeft &&
        ev.pageX <=
          dialogue[0].offsetParent.offsetLeft + dialogue[0].clientWidth,
      L =
        ev.pageY >= dialogue[0].offsetParent.offsetTop &&
        ev.pageY <=
          dialogue[0].offsetParent.offsetTop +
            dialogue[0].childNodes[0].offsetHeight &&
        ev.pageX >= dialogue[0].offsetParent.offsetLeft &&
        ev.pageX <= dialogue[0].offsetParent.offsetLeft + 5,
      R =
        ev.pageY >= dialogue[0].offsetParent.offsetTop &&
        ev.pageY <=
          dialogue[0].offsetParent.offsetTop +
            dialogue[0].childNodes[0].offsetHeight &&
        ev.pageX >=
          dialogue[0].offsetParent.offsetLeft + dialogue[0].clientWidth - 2 &&
        ev.pageX <=
          dialogue[0].offsetParent.offsetLeft + dialogue[0].clientWidth;

    if (T || L || R) return;
    let maxTop =
      document.documentElement.clientHeight -
      ev.target.offsetParent.clientHeight;
    let maxLeft =
      document.documentElement.clientWidth - ev.target.offsetParent.clientWidth;
    let dialogueContainer = ev.target.offsetParent.offsetParent;
    let startLeft = dialogueContainer.offsetLeft;
    let startTop = dialogueContainer.offsetTop;
    let diffX = ev.pageX - startLeft;
    let diffY = ev.pageY - startTop;
    this.setState({
      diffX: diffX,
      diffY: diffY,
      maxTop: maxTop,
      maxLeft: maxLeft
    });

    this._MOVE = this.mouseMove.bind(this);
    this._UP = this.mouseUp.bind(this);

    document.addEventListener("mousemove", this._MOVE);
    document.addEventListener("mouseup", this._UP);
  };
  mouseMove = ev => {
    let endLeft = ev.pageX - this.state.diffX;
    let endTop = ev.pageY - this.state.diffY;
    let { maxLeft, maxTop } = this.state;
    endLeft < 0
      ? (endLeft = 0)
      : endLeft > maxLeft
      ? (endLeft = maxLeft)
      : null;
    endTop < 0 ? (endTop = 0) : endTop > maxTop ? (endTop = maxTop) : null;
    this.setState({
      endLeft: endLeft - 5,
      endTop: endTop - 5
    });
  };
  mouseUp = ev => {
    document.removeEventListener("mousemove", this._MOVE);
    document.removeEventListener("mouseup", this._UP);
  };
  /* Enter */
  enterSend(ev) {
    let event = window.event || ev;
    let changeDialog = (num, value) => {
      let newdialog = this.state.dialog;
      newdialog.push({
        num: num,
        text: value
      });
      this.setState({
        dialog: newdialog
      });
    };
    if (event.keyCode == 13) {
      let value = event.target.value;
      if (value === "") return;
      changeDialog(1, value);
      const { API_URL_BASE, BOT_NAME } = this.props.config;
      const BotId = this.state.login.msg.id;

      let { ask } = services.main;
      ask(API_URL_BASE, BotId, value)
        .then(data => {
          this.setState({
            msg: data
          });
          changeDialog(2, data.msg.result);
          setTimeout(() => {
            let dialogue = document.getElementsByClassName("styles_wrap__33ZSE");
            dialogue[0].children[1].scrollTo(0, 99999999999999999999);
          }, 200);
        })
        .catch(err => {
          console.log(err);
        });
      event.target.value = "";
    }
  }
  /* 渲染对话 */
  renderDialog = () => {
    const { styleconfig } = this.props.config;
    let { dialog } = this.state;
    let { Code, answertype } = this.props.config;

    /* if (dialog.length > 0 && dialog[dialog.length - 1].num === 1) {
      dialog = dialog.slice(-1);
    } else {
      dialog = dialog.slice(-2);
    } */

    return dialog.map((item, index) => {
      let { num } = item;

      switch (num) {
        case 1:
          return (
            <Ask Askstyle={styleconfig.Askstyle} key={index} text={item.text} />
          );
        case 2:
          const a = Math.random();
          if (Code.length !== 0 && answertype !== "") {
            let Leadcode = Code.filter(item => {
              return item.type == answertype;
            })[0].code;
            return <Leadcode key={a} />;
          }
          return (
            <Answer
              Answerstyle={styleconfig.Answerstyle}
              key={index}
              text={item.text}
            />
          );
        default:
          return null;
      }
    });
  };
  audioClick = () => {
    this.setState({
      modelshow: !this.state.modelshow
    });
  };
  /* model */
  renderModel = () => {
    if (this.state.modelshow) {
      return (
        <div className={styles.model}>
          <div className={styles.content}>
            <div className={styles.icon}>
              <svg
                t="1578392386550"
                className="icon"
                viewBox="0 0 1024 1024"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                p-id="4489"
                width="40px"
                height="100%"
              >
                <path
                  d="M512 702.836364c-104.727273 0-190.836364-86.109091-190.836364-190.836364V190.836364C321.163636 86.109091 407.272727 0 512 0s190.836364 86.109091 190.836364 190.836364V512c0 104.727273-86.109091 190.836364-190.836364 190.836364z m0-642.327273c-72.145455 0-130.327273 58.181818-130.327273 130.327273V512c0 72.145455 58.181818 130.327273 130.327273 130.327273s130.327273-58.181818 130.327273-130.327273V190.836364c0-72.145455-58.181818-130.327273-130.327273-130.327273z"
                  p-id="4490"
                  fill="#7dc5eb"
                ></path>
                <path
                  d="M404.945455 1024c-16.290909 0-30.254545-13.963636-30.254546-30.254545 0-16.290909 13.963636-30.254545 30.254546-30.254546h76.8V861.090909c-86.109091-6.981818-167.563636-46.545455-225.745455-111.709091-62.836364-62.836364-95.418182-148.945455-95.418182-237.381818 0-16.290909 13.963636-30.254545 30.254546-30.254545s30.254545 13.963636 30.254545 30.254545c0 160.581818 130.327273 290.909091 290.909091 290.909091S802.909091 672.581818 802.909091 512c0-16.290909 13.963636-30.254545 30.254545-30.254545s30.254545 13.963636 30.254546 30.254545c0 88.436364-32.581818 174.545455-95.418182 239.709091-60.509091 65.163636-139.636364 102.4-225.745455 111.709091v100.072727h76.8c16.290909 0 30.254545 13.963636 30.254546 30.254546 0 16.290909-13.963636 30.254545-30.254546 30.254545h-214.10909z"
                  p-id="4491"
                  fill="#7dc5eb"
                ></path>
              </svg>
            </div>
            <div className={styles.text}>想问什么，说来听听</div>
            <div
              className={styles.fork}
              onClick={() => {
                this.setState({
                  modelshow: !this.state.modelshow
                });
              }}
            >
              <svg
                t="1578390547715"
                className="icon"
                viewBox="0 0 1024 1024"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                p-id="2861"
                width="15px"
                height="15px"
              >
                <path
                  d="M561.141 510.81l288.22-286.93a34.84 34.84 0 0 0 0.12-49.222 34.741 34.741 0 0 0-49.202-0.12l-288.26 286.97-285.738-286.87a34.761 34.761 0 1 0-49.222 49.163l285.718 286.81-288.122 286.73a34.82 34.82 0 0 0 49.024 49.402l288.18-286.87L800.2 849.365c6.774 6.853 15.693 10.25 24.651 10.25a34.82 34.82 0 0 0 24.611-59.413L561.141 510.81z"
                  p-id="2862"
                ></path>
              </svg>
            </div>
          </div>
        </div>
      );
    }
  };
  /* 渲染对话框 */
  renderDialogue = () => {
    const { config } = this.props;
    const { styleconfig } = this.props.config;
    if (this.state.dialogueshow) {
      return (
        <div
          className={styles.container}
          style={Object.assign(
            {
              left: this.state.endLeft + "px",
              top: this.state.endTop + "px"
            },
            { cursor: this.state.containercursor },
            {
              width: this.state.endWidth + "px",
              height: this.state.endHeight + "px"
            },
            styleconfig.Dialogstyle.container.style
          )}
        >
          {this.renderModel()}
          <div
            className={styles.wrap}
            style={styleconfig.Dialogstyle.container.wrap.style}
          >
            <header
              style={Object.assign(
                {
                  cursor: this.state.containercursor
                    ? this.state.containercursor
                    : "move"
                },
                { lineHeight: this.state.lineHeight + "px" },
                styleconfig.Dialogstyle.container.wrap.header.style
              )}
              onMouseDown={ev => {
                this.mouseDown(ev);
              }}
            >
              <div
                className={styles.text}
                style={styleconfig.Dialogstyle.container.wrap.header.text.style}
              >
                {config.text}
              </div>
            </header>
            <main
              className={styles.main}
              style={styleconfig.Dialogstyle.container.wrap.main.style}
            >
              {this.renderDialog()}
            </main>
            <footer style={styleconfig.Dialogstyle.container.wrap.footer.style}>
              <div
                className={styles.inputArea}
                style={
                  styleconfig.Dialogstyle.container.wrap.footer.inputArea.style
                }
              >
                <input
                  autoFocus
                  placeholder="请输入问题"
                  onKeyDown={ev => this.enterSend(ev)}
                  style={
                    styleconfig.Dialogstyle.container.wrap.footer.inputArea
                      .input.style
                  }
                />
              </div>
              <div
                className={styles.audio}
                style={
                  styleconfig.Dialogstyle.container.wrap.footer.audio.style
                }
              >
                <Recorder
                  Recorderstyle={styleconfig.Recorderstyle}
                  audioClick={this.audioClick}
                />
              </div>
            </footer>
          </div>
        </div>
      );
    }
  };
  componentDidUpdate(prevProps, prevState) {}
  render() {
    const { config } = this.props;
    const { styleconfig } = this.props.config;
    return (
      <div>
        <div
          className={styles.button}
          onClick={() => {
            this.setState({
              dialogueshow: !this.state.dialogueshow
            });
            if (this.state.dialogueshow) {
              let dialogue = document.getElementsByClassName(
                "styles_wrap__33ZSE"
              );
              const lineHeight = dialogue[0].childNodes[0].offsetHeight;
              this.setState({
                lineHeight: lineHeight
              });
            }
          }}
          style={styleconfig.Dialogstyle.button.style}
        >
          BUTTON
        </div>
        {this.renderDialogue()}
      </div>
    );
  }
}
export default ExampleComponent;
