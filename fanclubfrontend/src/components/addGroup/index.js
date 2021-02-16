import React, { Component } from "react";
import {
  Button,
  Form,
  Grid,
  Header,
  Message,
  Segment,
  Icon,
  TextArea,
} from "semantic-ui-react";
import { toast } from "react-toastify";
import history from "../../history";

import FetchApi from "../../utils/fetchAPI";
export default class index extends Component {
  state = {
    title: "",
    description: "",
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
    const { title, description, file, fileName } = this.state;
    const formData = new FormData();

    if (title) formData.append("title", title);
    if (description) formData.append("description", description);
    if (file) formData.append("group_img", file, fileName);
    formData.append("members", localStorage.getItem("user_id"));
    formData.append("admins", localStorage.getItem("user_id"));

    FetchApi(
      "post",
      "/chat/groups/",
      formData,
      localStorage.getItem("user_token")
    )
      .then((res) => {
        console.log(res.data);
        toast.success("Successfully Created a group");
        history.push("/");
      })
      .catch((error) => {
        console.log(error.response);
        toast.error("Error in creating group");
      });
  };

  render() {
    const { title, description } = this.state;
    return (
      <Grid
        textAlign="center"
        style={{ height: "80vh" }}
        verticalAlign="middle"
      >
        <Grid.Column style={{ maxWidth: 450 }}>
          <Header as="h2" color="teal" textAlign="center">
            Create New Group
          </Header>
          <Form size="large" onSubmit={this.handleSubmit}>
            <Segment stacked>
              <Form.Input
                required
                fluid
                icon="user"
                iconPosition="left"
                placeholder="Title"
                name="title"
                value={title}
                onChange={this.handleChange}
              />
              <Form.Input
                required
                fluid
                icon="at"
                control={TextArea}
                iconPosition="left"
                placeholder="Description"
                name="description"
                value={description}
                onChange={this.handleChange}
              />
              <Form.Input
                icon="image"
                iconPosition="left"
                name="group_img"
                type="file"
                placeholder="Group Image"
                onChange={this.fileChange}
              />

              <Button color="teal" fluid size="large">
                Add New Group
              </Button>
            </Segment>
          </Form>
        </Grid.Column>
      </Grid>
    );
  }
}
