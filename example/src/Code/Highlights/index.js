import React, { Component } from "react";
class Highlights extends Component {
  render() {
    return (
      <div
        style={{
          boxSizing: "border-box",
          width: "100%",
          display: "flex",
          marginBottom: "20px",
          paddingRight: "20px"
        }}
      >
        <div
          style={{
            fontSize: "20px",
            maxWidth: "1340px",
            padding: "0 10px",
            lineHeight: "50px",
            backgroundColor: "#f1f1f1",
            borderRadius: "10px",
            wordBreak: "break-all"
          }}
        >
          code
        </div>
      </div>
    );
  }
}

export default Highlights;
