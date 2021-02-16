import React, { Component } from "react";
import { BrowserRouter, Route, Switch,Router } from "react-router-dom";
import Main from "./main.js";
import "./App.css";
import history from "./history";
import { ToastContainer } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";

class App extends Component {
  render() {
    return (
      <div>
        <ToastContainer />
        <Router history={history}>
          <Main />
        </Router>
      </div>
    );
  }
}

export default App;
