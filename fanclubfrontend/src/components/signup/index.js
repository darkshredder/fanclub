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

class SignupForm extends Component {
  state = {
    full_name: "",
    email: "",
    password: "",
    re_password: "",
    phone_number: "",
    file: null,
    fileName: "",
  };

  handleChange = (e, { name, value }) => this.setState({ [name]: value });

  fileChange = (e) => {
    this.setState(
      { file: e.target.files[0], fileName: e.target.files[0].name },
      () => {
        console.log(
          "File chosen --->",
          this.state.file,
          console.log("File name  --->", this.state.fileName)
        );
      }
    );
  };

  handleSubmit = () => {
    const {
      full_name,
      email,
      password,
      re_password,
      phone_number,
      file,
      fileName,
    } = this.state;
    if (password == re_password && full_name) {
      const formData = new FormData();

      if (full_name) formData.append("full_name", full_name);
      if (email) formData.append("email", email);
      if (password) formData.append("password", password);
      if (phone_number) formData.append("phone_number", phone_number);
      if (file) formData.append("profile_img", file, fileName);

      FetchApi("post", "/auth/users/register/", formData, null)
        .then((res) => {
          console.log(res.data);
          localStorage.setItem("user_token", res.data.token);
          toast.success("Successfully Registered");
          history.push("/login");
        })
        .catch((error) => {
          console.log(error.response);
          toast.error("Email Id already registered");
        });
    } else {
      if (!full_name) {
        toast.error("Enter your full name");
      } else {
        toast.error("Password does not match");
      }
    }
  };

  render() {
    const {
      full_name,
      email,
      password,
      re_password,
      phone_number,
    } = this.state;
    return (
      <Grid
        textAlign="center"
        style={{ height: "100vh" }}
        verticalAlign="middle"
      >
        <Grid.Column style={{ maxWidth: 450 }}>
          <Header as="h2" color="teal" textAlign="center">
            SignUp your account
          </Header>
          <Form size="large" onSubmit={this.handleSubmit}>
            <Segment stacked>
              <Form.Input
                fluid
                icon="user"
                iconPosition="left"
                placeholder="Full Name"
                name="full_name"
                value={full_name}
                onChange={this.handleChange}
              />
              <Form.Input
                fluid
                icon="at"
                iconPosition="left"
                placeholder="E-mail address"
                name="email"
                value={email}
                onChange={this.handleChange}
              />
              <Form.Input
                fluid
                icon="phone"
                iconPosition="left"
                placeholder="Phone Number"
                name="phone_number"
                type="phone_number"
                value={phone_number}
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
              <Form.Input
                fluid
                icon="lock"
                iconPosition="left"
                placeholder="Enter your Password Again"
                name="re_password"
                type="password"
                value={re_password}
                onChange={this.handleChange}
              />
              <Form.Input
                fluid
                icon="image"
                iconPosition="left"
                name="profile_img"
                type="file"
                placeholder="Profile Image"
                onChange={this.fileChange}
              />

              <Button color="teal" fluid size="large">
                Signup
              </Button>
            </Segment>
          </Form>
          <Message>
            Already Signed Up? <a href="/login">Login</a>
          </Message>
        </Grid.Column>
      </Grid>
    );
  }
}

export default SignupForm;
