import React, { Component } from "react";
import { Switch, Route, BrowserRouter } from "react-router-dom";
import "semantic-ui-css/semantic.min.css";
import history from "./history";

import Login from "./components/login";
import Signup from "./components/signup";
import PrivateRoute from "./utils/privateRoute";
import LandingPage from "./components/landingPage";
import Groups from "./components/groups";

export class Main extends Component {
  render() {
    return (
      <div>
        <Switch>
          <PrivateRoute exact path="/groups" component={Groups} />
          <PrivateRoute exact path="/" component={LandingPage} />
          <Route exact path="/login" component={Login} />
          <Route exact path="/signup" component={Signup} />

          {/* <Route path="/event/:eventSlug" component={Events} /> */}
        </Switch>
      </div>
    );
  }
}

export default Main;
