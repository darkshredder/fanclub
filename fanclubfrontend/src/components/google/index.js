import React, { Component } from "react";
import { toast } from "react-toastify";
import { Container, Header } from "semantic-ui-react";
import history from "../../history";

import FetchApi from "../../utils/fetchAPI";

export default class index extends Component {
  componentDidMount = () => {
    let auth_code = new URLSearchParams(this.props.location.search).get("code");
    FetchApi(
      "post",
      `/auth/users/google_login_signup/`,
      { authcode: auth_code },
      null
    )
      .then((res) => {
        console.log(res.data);
        localStorage.setItem("user_token", res.data.token);
        localStorage.setItem("user_id", res.data.profile_id);
        toast.success("Successfully Logged In");
        history.push("/");
      })
      .catch((error) => {
        console.log(error.response);
        toast.error(error.response.data);
      });
  };

  render() {
    return <Header>Redirecting</Header>;
  }
}
