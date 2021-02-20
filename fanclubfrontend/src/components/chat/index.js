import React, { Component, useEffect } from "react";
import {
  Button,
  Form,
  TextArea,
  Segment,
  Icon,
  Container,
  Image,
  Table,
  Input,
  Message,
  Modal,
  Label,
} from "semantic-ui-react";

import { w3cwebsocket as W3CWebSocket } from "websocket";

import { toast } from "react-toastify";
import history from "../../history";

import FetchApi from "../../utils/fetchAPI";

export default class index extends Component {
  state = {
    groupData: null,
    new_message: "",
    client: null,
    new_recieved_messages: [],
    groupInfo: null,
    leaderboard: [],
  };

  scrollToBottom = () => {
    this.messagesEnd.scrollIntoView({ behavior: "smooth" });
  };
  scrollToUnread = () => {
    this.messagesUnread.scrollIntoView({ behavior: "smooth" });
  };

  validURL = (str) => {
    var pattern = new RegExp(
      "^(https?:\\/\\/)?" + // protocol
        "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // domain name
        "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
        "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
        "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
        "(\\#[-a-z\\d_]*)?$",
      "i"
    ); // fragment locator
    return !!pattern.test(str);
  };

  componentDidMount = () => {
    FetchApi(
      "get",
      `/chat/groups/${this.props.match.params.groupId}/leaderboard/`,
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

    FetchApi(
      "get",
      `/chat/groups/${this.props.match.params.groupId}/`,
      null,
      localStorage.getItem("user_token")
    )
      .then((res) => {
        console.log(res.data);
        this.setState({ groupInfo: res.data });
      })
      .catch((error) => {
        console.log(error.response);
        toast.error(error.response.data);
      });

    console.log(this.props.match.params.groupId);

    const client = new W3CWebSocket(
      `ws://localhost:8000/ws/group-chat/${
        this.props.match.params.groupId
      }?token=${localStorage.getItem("user_token")}`
    );
    this.setState({ client });
    FetchApi(
      "post",
      `/chat/messages/unread_read_group_messages/`,
      { group_id: this.props.match.params.groupId },
      localStorage.getItem("user_token")
    )
      .then((res) => {
        console.log(res.data);

        this.setState({
          groupData: res.data,
        });

        client.onopen = () => {
          console.log("WebSocket Client Connected");
        };
        setTimeout(() => {
          this.scrollToUnread();
        }, 300);

        client.onmessage = (message) => {
          let textMessage = JSON.parse(message.data);
          var m = new Date();
          textMessage.modified =
            m.getUTCFullYear() +
            "-" +
            ("0" + (m.getUTCMonth() + 1)).slice(-2) +
            "-" +
            ("0" + m.getUTCDate()).slice(-2) +
            " " +
            ("0" + m.getUTCHours()).slice(-2) +
            ":" +
            ("0" + m.getUTCMinutes()).slice(-2) +
            ":" +
            ("0" + m.getUTCSeconds()).slice(-2);
          console.log(textMessage);
          this.setState((prevState) => ({
            new_recieved_messages: [
              ...prevState.new_recieved_messages,
              textMessage,
            ],
          }));
          console.log(this.state.new_recieved_messages);
          this.scrollToBottom();
        };
      })
      .catch((error) => {
        console.log(error.response);
        toast.error("Error fetching profile");
      });
  };

  sendMessage = () => {
    const { client, new_message } = this.state;
    if (new_message) {
      client.send(JSON.stringify({ message: new_message }));
      this.setState({ new_message: "" });
    }
  };

  handleChange = (e, { name, value }) => this.setState({ [name]: value });

  onFileUpload = (e) => {
    console.log(e.target.files[0]);
    const formData = new FormData();

    formData.append("file", e.target.files[0]);
    formData.append("upload_preset", "fuwbum9f");

    let options = {
      method: "POST",
      body: formData,
    };

    fetch("https://api.Cloudinary.com/v1_1/dcbgaudem/image/upload", options)
      .then((res) => res.json())
      .then((res) => {
        this.setState({ new_message: res?.secure_url });
        this.sendMessage();
      })
      .catch((err) => console.log(err));
  };

  render() {
    const {
      groupData,
      new_message,
      new_recieved_messages,
      groupInfo,
      leaderboard,
    } = this.state;
    return (
      <Container>
        <Segment>
          <Segment style={{display:"flex", justifyContent:"space-between"}}>
            <div>
              <Image
                src={
                  groupInfo?.group_img
                    ? `${groupInfo?.group_img}`
                    : `https://react.semantic-ui.com/images/wireframe/square-image.png`
                }
                style={{ cursor: "pointer" }}
                avatar
              />
              <span style={{ fontSize: 20, marginLeft: 5 }}>
                {groupInfo?.title}
              </span>
            </div>
            <div>
              <GroupMembers groupInfo={groupInfo} />
              <GroupDetails groupInfo={groupInfo} />
              <GroupLeaderboard
                groupInfo={groupInfo}
                leaderboard={leaderboard}
              />
            </div>
          </Segment>
          <Segment style={{ overflow: "auto", height: "50vh" }}>
            {groupData?.read_messages?.map((message, i) => {
              return (
                <Container
                  style={{
                    padding: 20,
                    textAlign:
                      localStorage.getItem("user_id") ==
                      message?.profile_from?.id
                        ? "right"
                        : "left",
                  }}
                >
                  <Image
                    src={
                      message?.profile_from?.profile_img
                        ? `http://localhost:8000${message?.profile_from?.profile_img}`
                        : `https://react.semantic-ui.com/images/wireframe/square-image.png`
                    }
                    style={{ cursor: "pointer" }}
                    avatar
                    onClick={() => {
                      history.push(`/profile/${message?.profile_from?.id}`);
                    }}
                  />
                  <Message compact size="large">
                    <Message.Header
                      style={{
                        fontSize: 15,
                        fontWeight: "normal",
                        color: "gray",
                      }}
                    >
                      {message?.profile_from?.full_name} - {message?.modified}
                    </Message.Header>
                    {this.validURL(message?.text) ? (
                      <Image size="medium" src={message?.text}></Image>
                    ) : (
                      <Message.Content>{message?.text}</Message.Content>
                    )}
                  </Message>
                </Container>
              );
            })}
            {groupData?.unread_messages.length > 0 ? (
              <Message fluid>Unread Messages below</Message>
            ) : null}

            <div
              style={{ float: "left", clear: "both" }}
              ref={(el) => {
                this.messagesUnread = el;
              }}
            ></div>
            {groupData?.unread_messages?.map((message, i) => {
              return (
                <Container
                  style={{
                    padding: 20,
                    textAlign:
                      localStorage.getItem("user_id") ==
                      message?.profile_from?.id
                        ? "right"
                        : "left",
                  }}
                >
                  <Image
                    src={
                      message?.profile_from?.profile_img
                        ? `http://localhost:8000${message?.profile_from?.profile_img}`
                        : `https://react.semantic-ui.com/images/wireframe/square-image.png`
                    }
                    style={{ cursor: "pointer" }}
                    avatar
                    onClick={() => {
                      history.push(`/profile/${message?.profile_from?.id}`);
                    }}
                  />
                  <Message compact size="large">
                    <Message.Header
                      style={{
                        fontSize: 15,
                        fontWeight: "normal",
                        color: "gray",
                      }}
                    >
                      {message?.profile_from?.full_name} - {message?.modified}
                    </Message.Header>
                    {this.validURL(message?.text) ? (
                      <Image size="medium" src={message?.text}></Image>
                    ) : (
                      <Message.Content>{message?.text}</Message.Content>
                    )}
                  </Message>
                </Container>
              );
            })}
            {new_recieved_messages?.map((message, i) => {
              return (
                <Container
                  style={{
                    padding: 20,
                    textAlign:
                      localStorage.getItem("user_id") == message?.username?.id
                        ? "right"
                        : "left",
                  }}
                >
                  <Image
                    src={
                      message?.username?.profile_img
                        ? `http://localhost:8000${message?.username?.profile_img}`
                        : `https://react.semantic-ui.com/images/wireframe/square-image.png`
                    }
                    style={{ cursor: "pointer" }}
                    avatar
                    onClick={() => {
                      history.push(`/profile/${message?.username?.id}`);
                    }}
                  />
                  <Message compact size="large">
                    <Message.Header
                      style={{
                        fontSize: 15,
                        fontWeight: "normal",
                        color: "gray",
                      }}
                    >
                      {message?.username?.full_name} - {message?.modified}
                    </Message.Header>
                    {this.validURL(message?.message) ? (
                      <Image size="medium" src={message?.message}></Image>
                    ) : (
                      <Message.Content>{message?.message}</Message.Content>
                    )}
                  </Message>
                </Container>
              );
            })}
            <div
              style={{ float: "left", clear: "both" }}
              ref={(el) => {
                this.messagesEnd = el;
              }}
            ></div>
          </Segment>
        </Segment>
        <Segment style={{ display: "flex" }}>
          <Button
            as="div"
            labelPosition="right"
            onClick={() => this.input.click()}
          >
            <Button icon title="Upload Image" color="teal" fluid>
              <Icon name="image" />
            </Button>
          </Button>

          <input
            ref={(element) => (this.input = element)}
            hidden
            onChange={(e) => this.onFileUpload(e)}
            type="file"
          />
          <Input
            action={{
              icon: "send",
              color: "teal",
              onClick: () => this.sendMessage(),
            }}
            placeholder="Type a new Message"
            onChange={this.handleChange}
            name="new_message"
            value={new_message}
            onKeyPress={(event) => event.key === "Enter" && this.sendMessage()}
            style={{ display: "contents" }}
          />
        </Segment>
      </Container>
    );
  }
}

const GroupMembers = (props) => {
  const [open, setOpen] = React.useState(false);

  const addAdmin = (id) => {
    FetchApi(
      "post",
      `/chat/groups/add_admin/`,
      { group_id: props?.groupInfo?.id, new_admin_id: id },
      localStorage.getItem("user_token")
    )
      .then((res) => {
        console.log(res.data);
        toast.success("Added as a Admin Please Refresh");
      })
      .catch((error) => {
        console.log(error.response);
        toast.error(error.response.data);
      });
  };

  console.log(props.groupInfo);

  return (
    <Modal
      open={open}
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      trigger={<Button style={{ float: "right" }}>Group Members</Button>}
    >
      <Modal.Header>Group Members</Modal.Header>
      <Modal.Content scrolling>
        <Modal.Description>
          <Table padded color="black">
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Profile</Table.HeaderCell>
                <Table.HeaderCell>Status</Table.HeaderCell>
                {props?.groupInfo?.admins.some(
                  (admin) =>
                    admin.id === Number(localStorage.getItem("user_id"))
                ) ? (
                  <Table.HeaderCell>Action</Table.HeaderCell>
                ) : null}
              </Table.Row>
            </Table.Header>

            <Table.Body>
              {props?.groupInfo?.members?.map((member, index) => {
                return (
                  <Table.Row key={index}>
                    <Table.Cell>
                      <Image
                        src={
                          member?.profile_img
                            ? `${member?.profile_img}`
                            : `https://react.semantic-ui.com/images/wireframe/square-image.png`
                        }
                        style={{ cursor: "pointer" }}
                        avatar
                        onClick={() => {
                          history.push(`/profile/${member?.id}`);
                        }}
                      />
                      {member?.full_name}
                    </Table.Cell>
                    <Table.Cell>
                      {props?.groupInfo?.admins.some(
                        (admin) => admin.email === member.email
                      )
                        ? "Admin"
                        : "Member"}
                    </Table.Cell>
                    {props?.groupInfo?.admins.some(
                      (admin) =>
                        admin.id === Number(localStorage.getItem("user_id"))
                    ) ? (
                      <Table.Cell>
                        <Button
                          positive
                          onClick={() => {
                            addAdmin(member.id);
                          }}
                          disabled={props?.groupInfo?.admins.some(
                            (admin) => admin.email === member.email
                          )}
                        >
                          Add Admin
                        </Button>
                      </Table.Cell>
                    ) : null}
                  </Table.Row>
                );
              })}
            </Table.Body>
          </Table>
        </Modal.Description>
      </Modal.Content>
      <Modal.Actions>
        <Button onClick={() => setOpen(false)} positive>
          Done
        </Button>
      </Modal.Actions>
    </Modal>
  );
};

const GroupDetails = (props) => {
  const [open, setOpen] = React.useState(false);
  const [editable, setEditable] = React.useState(false);
  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState(
    props?.groupInfo?.description
  );
  const [file, setFile] = React.useState(null);
  const [fileName, setFileName] = React.useState("");

  useEffect(() => {
    if (
      props?.groupInfo?.admins.some(
        (admin) => admin.id === Number(localStorage.getItem("user_id"))
      )
    ) {
      setEditable(true);
    }
  });

  const handleSubmit = () => {
    const formData = new FormData();

    if (title) formData.append("title", title);
    if (description) formData.append("description", description);
    if (file) formData.append("group_img", file, fileName);

    FetchApi(
      "patch",
      `/chat/groups/${props?.groupInfo?.id}/`,
      formData,
      localStorage.getItem("user_token")
    )
      .then((res) => {
        console.log(res.data);
        toast.success("Successfully updated Group");
      })
      .catch((error) => {
        console.log(error.response);
        toast.error(error.response.data);
      });
  };

  const addAdmin = (id) => {
    FetchApi(
      "post",
      `/chat/groups/add_admin/`,
      { group_id: props?.groupInfo?.id, new_admin_id: id },
      localStorage.getItem("user_token")
    )
      .then((res) => {
        console.log(res.data);
        toast.success("Added as a Admin Please Refresh");
      })
      .catch((error) => {
        console.log(error.response);
        toast.error(error.response.data);
      });
  };

  return (
    <Modal
      open={open}
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      trigger={<Button style={{ float: "right" }}>Group Details</Button>}
    >
      <Modal.Header>Group Details</Modal.Header>
      <Modal.Content scrolling>
        <Modal.Description>
          <Segment>
            <Form onSubmit={handleSubmit}>
              <Image
                src={
                  props?.groupInfo?.group_img
                    ? `${props?.groupInfo?.group_img}`
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
                  name="group_img"
                  type="file"
                  placeholder="Change Group Image"
                  onChange={(e) => {
                    setFile(e.target.files[0]);
                    setFileName(e.target.files[0].name);
                  }}
                />
              ) : null}

              <Form.Input
                placeholder="Title"
                name="title"
                label="Title"
                defaultValue={props?.groupInfo?.title}
                onChange={(e) => setTitle(e.target.value)}
                readOnly={!editable}
              />
              <Form.Input
                required
                fluid
                icon="at"
                control={TextArea}
                iconPosition="left"
                placeholder="Description"
                name="description"
                readOnly={!editable}
                defaultValue={props?.groupInfo?.description}
                onChange={(e) => setDescription(e.target.value)}
              />

              {editable ? (
                <Button color="teal" fluid size="large">
                  Save Changes
                </Button>
              ) : null}
            </Form>
          </Segment>
        </Modal.Description>
      </Modal.Content>
      <Modal.Actions>
        <Button onClick={() => setOpen(false)} positive>
          Done
        </Button>
      </Modal.Actions>
    </Modal>
  );
};

const GroupLeaderboard = (props) => {
  const [open, setOpen] = React.useState(false);

  console.log(props.groupInfo);

  return (
    <Modal
      open={open}
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      trigger={<Button style={{ float: "right" }}>Leaderboard</Button>}
    >
      <Modal.Header>Leaderboard</Modal.Header>
      <Modal.Content scrolling>
        <Modal.Description>
          <Table padded color="black">
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Rank</Table.HeaderCell>
                <Table.HeaderCell>Profile</Table.HeaderCell>
                <Table.HeaderCell>Message Count</Table.HeaderCell>
              </Table.Row>
            </Table.Header>

            <Table.Body>
              {props?.leaderboard?.map((member, index) => {
                return (
                  <Table.Row key={index}>
                    <Table.Cell>{index + 1}</Table.Cell>
                    <Table.Cell>
                      <Image
                        src={
                          member?.profile_img
                            ? `http://localhost:8000${member?.profile_img}`
                            : `https://react.semantic-ui.com/images/wireframe/square-image.png`
                        }
                        style={{ cursor: "pointer" }}
                        avatar
                        onClick={() => {
                          history.push(`/profile/${member?.id}`);
                        }}
                      />
                      {member?.full_name}
                    </Table.Cell>
                    <Table.Cell>{member?.total_messages}</Table.Cell>
                  </Table.Row>
                );
              })}
            </Table.Body>
          </Table>
        </Modal.Description>
      </Modal.Content>
      <Modal.Actions>
        <Button onClick={() => setOpen(false)} positive>
          Done
        </Button>
      </Modal.Actions>
    </Modal>
  );
};
