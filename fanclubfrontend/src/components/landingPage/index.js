import React, { Component } from "react";
import { Table, Button } from "semantic-ui-react";
import FetchApi from "../../utils/fetchAPI";
import { toast } from "react-toastify";
import history from "../../history";

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
      <Table padded color="black">
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Title</Table.HeaderCell>
            <Table.HeaderCell>Description</Table.HeaderCell>
            <Table.HeaderCell>Action</Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {followedGroups?.map((g, index) => {
            return (
              <Table.Row key={index}>
                <Table.Cell>{g.title}</Table.Cell>
                <Table.Cell>{g.description}</Table.Cell>
                <Table.Cell>
                  <Button
                    positive
                    onClick={() => {
                      history.push(`/chat/${g.id}`)
                    }}
                  >
                    View
                  </Button>
                </Table.Cell>
              </Table.Row>
            );
          })}
        </Table.Body>
      </Table>
    );
  }
}
