import React, { Component } from "react";
import { Table, Button } from "semantic-ui-react";
import FetchApi from "../../utils/fetchAPI";
import { toast } from "react-toastify";

export default class groups extends Component {
  state = { allGroups: null, user_id: "" };
  componentDidMount = () => {
    FetchApi("get", "/chat/groups/", null, localStorage.getItem("user_token"))
      .then((res) => {
        console.log(res.data);
        this.setState({
          allGroups: res.data,
          user_id: localStorage.getItem("user_id"),
        });
      })
      .catch((error) => {
        console.log(error.response);
        toast.error(error.response.data);
      });
  };
  followGroup = (id) => {
    FetchApi(
      "get",
      `/chat/groups/${id}/follow_group`,
      null,
      localStorage.getItem("user_token")
    )
      .then((res) => {
        console.log(res.data);
        this.setState({
          allGroups: res.data,
        });
        toast.success("Successfully followed the group");
      })
      .catch((error) => {
        console.log(error.response);
        toast.error(error.response.data);
      });
  };
  unfollowGroup = (id) => {
    FetchApi(
      "get",
      `/chat/groups/${id}/unfollow_group`,
      null,
      localStorage.getItem("user_token")
    )
      .then((res) => {
        console.log(res.data);
        toast.success("Successfully unfollowed the group");
        this.setState({
          allGroups: res.data,
        });
      })
      .catch((error) => {
        console.log(error.response);
        toast.error(error.response.data);
      });
  };
  render() {
    const { allGroups, user_id } = this.state;
    return (
      <Table padded color="black" inverted>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Name</Table.HeaderCell>
            <Table.HeaderCell>Description</Table.HeaderCell>
            <Table.HeaderCell>Status</Table.HeaderCell>
            <Table.HeaderCell>Action</Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {allGroups?.map((g, index) => {
            return (
              <Table.Row key={index}>
                <Table.Cell>{g.title}</Table.Cell>
                <Table.Cell>{g.description}</Table.Cell>
                <Table.Cell>
                  {g.members.includes(Number(user_id))
                    ? "Following"
                    : "Not Following"}
                </Table.Cell>
                <Table.Cell>
                  {!g.members.includes(Number(user_id)) ? (
                    <Button
                      positive
                      onClick={() => {
                        this.followGroup(g.id);
                      }}
                    >
                      Follow
                    </Button>
                  ) : (
                    <Button
                      negative
                      onClick={() => {
                        this.unfollowGroup(g.id);
                      }}
                    >
                      Unfollow
                    </Button>
                  )}
                </Table.Cell>
              </Table.Row>
            );
          })}
        </Table.Body>
      </Table>
    );
  }
}
