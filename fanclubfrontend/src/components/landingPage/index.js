import React, { Component } from "react";
import { Table } from "semantic-ui-react";
import FetchApi from "../../utils/fetchAPI";
import { toast } from "react-toastify";

export default class landingPage extends Component {
  state = { followedGroups: null };
  componentDidMount = () => {
    FetchApi(
      "get",
      "/chat/groups/followed_groups/",
      null,
      localStorage.getItem("user_token")
    )
      .then((res) => {
        console.log(res.data);
        this.setState({ followedGroups: res.data });
      })
      .catch((error) => {
        console.log(error.response);
        toast.error(error.response.data);
      });
  };
  render() {
    const { followedGroups } = this.state;
    return (
      <Table padded color="black" inverted>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Name</Table.HeaderCell>
            <Table.HeaderCell>Description</Table.HeaderCell>
            <Table.HeaderCell>Status</Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {followedGroups?.map((g, index) => {
            return (
              <Table.Row key={index}>
                <Table.Cell>{g.title}</Table.Cell>
                <Table.Cell>{g.description}</Table.Cell>
                <Table.Cell>Following</Table.Cell>
              </Table.Row>
            );
          })}
        </Table.Body>
      </Table>
    );
  }
}
