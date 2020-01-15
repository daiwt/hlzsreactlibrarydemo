import React, { Component } from 'react'

import ExampleComponent from 'hlzsreactlibrarydemo'

import "./index.css";
import config from "./config";

export default class App extends Component {
  render () {
    return (
      <div>
        <ExampleComponent config={config} />
      </div>
    )
  }
}
