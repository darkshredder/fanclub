import React, { Component } from "react";
import {
  Menu,
  Segment,
  Dropdown,
  Header,
  Icon,
  Image,
} from "semantic-ui-react";
import FetchApi from "../../utils/fetchAPI";
import { toast } from "react-toastify";
import history from "../../history";

export default class Navbar extends Component {
  state = { activeItem: "Following Chat Rooms", profile: null };

  componentDidMount = () => {
    if (history.location.pathname === "/") {
      this.setState({ activeItem: "Following Chat Rooms" });
    }
    if (history.location.pathname === "/groups") {
      this.setState({ activeItem: "All Chat Rooms" });
    }
    if (history.location.pathname === "/create_group") {
      this.setState({ activeItem: "Create New Chat Room" });
    }
    FetchApi(
      "get",
      "/auth/users/profile/",
      null,
      localStorage.getItem("user_token")
    )
      .then((res) => {
        console.log(res.data);
        this.setState({ profile: res.data });
        localStorage.setItem("user_id", res.data.id);
      })
      .catch((error) => {
        console.log(error.response);
        toast.error(error.response.data);
      });
  };

  handleItemClick = (e, { name }) => {
    this.setState({ activeItem: name });
    if (name === "Following Chat Rooms") {
      history.push("/");
    }
    if (name === "All Chat Rooms") {
      history.push("/groups");
    }
    if (name === "Create New Chat Room") {
      history.push("/create_group");
    }
  };

  render() {
    const { activeItem, profile } = this.state;
    const options = [
      {
        key: "Name",
        text: profile?.full_name,
        value: profile?.full_name,
        content: profile?.full_name,
      },
      {
        key: "Edit Profile",
        text: "Edit Profile",
        value: "Edit Profile",
        content: "Edit Profile",
      },
      {
        key: "Log Out",
        text: "Log Out",
        value: "Log Out",
        content: "Log Out",
      },
    ];
    return (
      <Segment>
        <Menu pointing secondary>
          <Menu.Item
            name="Following Chat Rooms"
            active={activeItem === "Following Chat Rooms"}
            onClick={this.handleItemClick}
          />
          <Menu.Item
            name="All Chat Rooms"
            active={activeItem === "All Chat Rooms"}
            onClick={this.handleItemClick}
          />
          <Menu.Item
            name="Create New Chat Room"
            active={activeItem === "Create New Chat Room"}
            onClick={this.handleItemClick}
          />
          <Menu.Menu position="right">
            <Header as="h4">
              <Image
                src={"http://localhost:8000" + profile?.profile_img}
                circular
              />
              <Header.Content>
                <Dropdown
                  inline
                  header="Profile"
                  options={options}
                  defaultValue={options[0].value}
                />
              </Header.Content>
            </Header>
          </Menu.Menu>
        </Menu>
      </Segment>
    );
  }
}
