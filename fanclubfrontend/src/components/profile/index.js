import React, { Component } from "react";
import {
  Button,
  Form,
  Header,
  Segment,
  Icon,
  Container,
  Image,
  Label,
  Input,
} from "semantic-ui-react";

import { toast } from "react-toastify";
import history from "../../history";

import FetchApi from "../../utils/fetchAPI";
export default class index extends Component {
  state = {
    profileData: null,
    editable: false,
    full_name: "",
    email: "",
    phone_number: "",
    file: "",
    fileName: "",
    profile_img: null,
    new_hobby: "",
  };

  componentDidMount = () => {
    console.log(this.props.match.params.profileId);
    FetchApi(
      "get",
      `/auth/users/${this.props.match.params.profileId}/`,
      null,
      localStorage.getItem("user_token")
    )
      .then((res) => {
        console.log(res.data);

        if (
          Number(
            localStorage.getItem("user_id") ==
              Number(this.props.match.params.profileId)
          )
        ) {
          this.setState({
            editable: true,
          });
          console.log(this.state.editable);
        }

        this.setState({
          profileData: res.data,
          full_name: res.data.full_name,
          email: res.data.email,
          phone_number: res.data.phone_number,
          profile_img: res.data.profile_img,
        });
      })
      .catch((error) => {
        console.log(error.response);
        toast.error("Error fetching profile");
      });
  };

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

  handleChange = (e, { name, value }) => this.setState({ [name]: value });

  handleSaveChanges = () => {
    const { full_name, email, phone_number, file, fileName } = this.state;
    if (full_name) {
      const formData = new FormData();

      if (full_name) formData.append("full_name", full_name);
      if (email) formData.append("email", email);
      if (phone_number) formData.append("phone_number", phone_number);
      if (file) formData.append("profile_img", file, fileName);

      FetchApi(
        "post",
        "/auth/users/partial_update_profile/",
        formData,
        localStorage.getItem("user_token")
      )
        .then((res) => {
          console.log(res.data);
          toast.success("Successfully Made changes");
          this.componentDidMount();
        })
        .catch((error) => {
          console.log(error.response);
          toast.error("Error on updating profile");
        });
    } else {
      if (!full_name) {
        toast.error("Enter your full name");
      }
    }
  };

  addHobby = () => {
    FetchApi(
      "post",
      "/auth/users/add_hobby/",
      { hobby: this.state.new_hobby },
      localStorage.getItem("user_token")
    )
      .then((res) => {
        console.log(res.data);
        toast.success("Successfully Added new Hobby");
        this.componentDidMount();
      })
      .catch((error) => {
        console.log(error.response);
        toast.error("Error on adding hobby");
      });
  };

  removeHobby = (id) => {
    FetchApi(
      "post",
      "/auth/users/remove_hobby/",
      { hobbyId: id },
      localStorage.getItem("user_token")
    )
      .then((res) => {
        console.log(res.data);
        toast.success("Successfully removed hobby");
        this.componentDidMount();
      })
      .catch((error) => {
        console.log(error.response);
        toast.error("Error on removing hobby");
      });
  };

  render() {
    const {
      profileData,
      full_name,
      email,
      profile_img,
      phone_number,
      editable,
    } = this.state;
    return (
      <Container>
        <Segment>
          <Form onSubmit={this.handleSaveChanges}>
            <Image
              src={
                profile_img
                  ? `http://localhost:8000${profile_img}`
                  : `https://react.semantic-ui.com/images/wireframe/square-image.png`
              }
              size="small"
              circular
              centered
            />
            {editable ? (
              <Form.Input
                fluid
                icon="image"
                iconPosition="left"
                name="profile_img"
                type="file"
                placeholder="Change Profile Image"
                onChange={this.fileChange}
              />
            ) : null}

            <Form.Input
              placeholder="Full Name"
              name="full_name"
              label="Full Name"
              value={full_name}
              onChange={this.handleChange}
              readOnly={!editable}
            />
            <Form.Input
              placeholder="Email Id"
              name="email"
              label="Email Id"
              value={email}
              onChange={this.handleChange}
              readOnly={!editable}
            />
            <Form.Input
              placeholder="Phone Number"
              name="phone_number"
              label="Phone Number"
              value={phone_number}
              onChange={this.handleChange}
              readOnly={!editable}
            />
            {editable ? (
              <Button color="teal" fluid size="large">
                Save Changes
              </Button>
            ) : null}
          </Form>
        </Segment>
        <Segment padded>
          <Header textAlign="center">Hobbies</Header>

          {profileData?.hobbies?.map((hobby, index) => {
            return (
              <Button as="div" labelPosition="left">
                <Label as="a" basic>
                  {hobby.name}
                </Label>
                {editable ? (
                  <Button
                    icon
                    color="red"
                    onClick={() => this.removeHobby(hobby.id)}
                  >
                    <Icon name="remove" />
                  </Button>
                ) : null}
              </Button>
            );
          })}
          {editable ? (
            <Input
              action={{
                icon: "add",
                color: "teal",
                onClick: () => this.addHobby(),
              }}
              placeholder="Add New Hobby"
              onChange={this.handleChange}
              name="new_hobby"
            />
          ) : null}
        </Segment>
      </Container>
    );
  }
}
