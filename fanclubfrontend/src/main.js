import React, { Component } from "react";
import { Switch, Route, BrowserRouter } from "react-router-dom";
import "semantic-ui-css/semantic.min.css";
import history from "./history";

import Login from "./components/login";
import Signup from "./components/signup";
import PrivateRoute from "./utils/privateRoute";
import LandingPage from "./components/landingPage";
import Groups from "./components/groups";
import AddGroup from "./components/addGroup";
import Profile from "./components/profile";
import Chat from "./components/chat";
import Google from "./components/google";

export class Main extends Component {
  render() {
    return (
      <div>
        <Switch>
          <PrivateRoute exact path="/create_group" component={AddGroup} />
          <PrivateRoute exact path="/groups" component={Groups} />
          <PrivateRoute exact path="/" component={LandingPage} />
          <PrivateRoute path="/profile/:profileId" component={Profile} />
          <PrivateRoute path="/chat/:groupId" component={Chat} />
          <Route exact path="/login" component={Login} />
          <Route exact path="/signup" component={Signup} />
          <Route exact path="/google" component={Google} />
        </Switch>
      </div>
    );
  }
}

export default Main;
