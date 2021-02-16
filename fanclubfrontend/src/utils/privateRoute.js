import React from "react";
import { Route, Redirect } from "react-router-dom";
import { Container } from "semantic-ui-react";
import Navbar from "../components/navbar";
const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={(props) =>
      localStorage.getItem("user_token") ? (
        <Container
          style={{ display: "flex", flexDirection: "column", margin: 20 }}
        >
          <Navbar />
          <Component {...props} tab={rest.tab} />
        </Container>
      ) : (
        <Redirect to="/login" />
      )
    }
  />
);

export default PrivateRoute;
