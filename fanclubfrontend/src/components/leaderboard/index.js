import React, { Component } from "react";
import { Table, Button, Image } from "semantic-ui-react";
import FetchApi from "../../utils/fetchAPI";
import { toast } from "react-toastify";
import history from "../../history";

export default class index extends Component {
  state = { leaderboard: null };
  componentDidMount = () => {
    FetchApi(
      "get",
      "/auth/users/leaderboard/",
      null,
      localStorage.getItem("user_token")
    )
      .then((res) => {
        console.log(res.data);
        this.setState({ leaderboard: res.data });
      })
      .catch((error) => {
        console.log(error.response);
        toast.error(error.response.data);
      });
  };
  render() {
    const { leaderboard } = this.state;
    return (
      <Table padded color="black">
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Rank</Table.HeaderCell>
            <Table.HeaderCell>Profile</Table.HeaderCell>
            <Table.HeaderCell>Message Count</Table.HeaderCell>
            <Table.HeaderCell>Last Login</Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {leaderboard?.map((user, index) => {
            return (
              <Table.Row key={index}>
                <Table.Cell>{index + 1}</Table.Cell>
                <Table.Cell>
                  <Image
                    src={
                      user?.profile_img
                        ? `http://localhost:8000${user?.profile_img}`
                        : `https://react.semantic-ui.com/images/wireframe/square-image.png`
                    }
                    style={{ cursor: "pointer" }}
                    avatar
                    onClick={() => {
                      history.push(`/profile/${user?.id}`);
                    }}
                  />
                  {user?.full_name}
                </Table.Cell>
                <Table.Cell>{user?.total_messages}</Table.Cell>
                <Table.Cell>
                  {user?.last_login ? user?.last_login : "Never Logged In"}{" "}
                </Table.Cell>
              </Table.Row>
            );
          })}
        </Table.Body>
      </Table>
    );
  }
}
