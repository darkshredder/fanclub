import React, { Component } from "react";
import {
  Button,
  Form,
  Grid,
  Header,
  Message,
  Segment,
  Icon,
} from "semantic-ui-react";
import { toast } from "react-toastify";
import history from "../../history";

import FetchApi from "../../utils/fetchAPI";

class LoginForm extends Component {
  state = { password: "", email: "" };

  handleChange = (e, { name, value }) => this.setState({ [name]: value });

  handleSubmit = () => {
    const { password, email } = this.state;
    let data = { email, password };

    FetchApi("post", "/auth/users/login/", data, null)
      .then((res) => {
        console.log(res.data);
        localStorage.setItem("user_token", res.data.token);
        toast.success("Successfully Logged In");
        this.props.history.push("/");
      })
      .catch((error) => {
        console.log(error.response);
        toast.error(error.response.data);
      });
  };

  render() {
    const { password, email } = this.state;
    return (
      <Grid
        textAlign="center"
        style={{ height: "100vh" }}
        verticalAlign="middle"
      >
        <Grid.Column style={{ maxWidth: 450 }}>
          <Header as="h2" color="teal" textAlign="center">
            Log-in to your account
          </Header>
          <Form size="large" onSubmit={this.handleSubmit}>
            <Segment stacked>
              <Form.Input
                fluid
                icon="user"
                iconPosition="left"
                placeholder="E-mail address"
                name="email"
                value={email}
                onChange={this.handleChange}
              />
              <Form.Input
                fluid
                icon="lock"
                iconPosition="left"
                placeholder="Password"
                name="password"
                type="password"
                value={password}
                onChange={this.handleChange}
              />

              <Button color="teal" fluid size="large">
                Login
              </Button>
            </Segment>
          </Form>
          <div style={{ margin: 25 }}>
            <Button color="google plus">
              <Icon name="google" /> Sign In with Google
            </Button>
          </div>

          <Message>
            New to us? <a href="/signup">Sign Up</a>
          </Message>
        </Grid.Column>
      </Grid>
    );
  }
}

export default LoginForm;
