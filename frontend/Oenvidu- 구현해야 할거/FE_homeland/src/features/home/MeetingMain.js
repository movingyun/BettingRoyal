/* eslint-disable */
import axios from "axios";
import { OpenVidu } from "openvidu-browser";
import React, { useEffect, useState, Component, createRef } from "react";
import "./MeetingMain.css";
import UserVideoComponent from "./UserVideoComponent";
import Messages from "../chat/Messages";
import {
  IoMicSharp,
  IoMicOffSharp,
  IoVideocamOff,
  IoVideocam,
  IoCameraSharp,
  IoExit,
  IoMdCopy,
  IoCopy,
  IoGameController,
  IoBeer,
} from "react-icons/io5";
import html2canvas from "html2canvas";
import { FormControl, FormControlLabel, Button } from "@mui/material";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import TextField from "@mui/material/TextField";

// img
import beerL from "./img/beer_left.png";
import beerR from "./img/beer_right.png";
import Q from "./img/Q.png";
import E from "./img/E.png";
import E2 from "./img/E2.png";
import PermissionIMG from "./img/PermissionControl.png";

import Swal from "sweetalert2";

import { IoMdExpand, IoMdContract } from "react-icons/io";

import { Container, Row, Col } from "react-bootstrap";

import Cheersmain from "./Cheersmain";

import GamePanel from "./GamePanel";
import { margin, width } from "@mui/system";

import ReactTooltip from "react-tooltip";
import { Link, Route, Switch } from "react-router-dom";

const OPENVIDU_SERVER_URL = process.env.REACT_APP_OPENVIDU_SERVER_URL;
const OPENVIDU_SERVER_SECRET = process.env.REACT_APP_OPENVIDU_SERVER_SECRET;
const BEUrl = process.env.REACT_APP_BACKEND_URL;

const btn_size = "48";
const icon_color = "rgb(52, 62, 118)";
const icon_color_off = "rgb(89, 96, 138)";

class Main extends Component {
  constructor(props) {
    super(props);

    this.state = {
      sessionData: [],
      mySessionId: "",
      myUserName: "",
      session: undefined,
      mainStreamManager: undefined,
      publisher: undefined,
      subscribers: [],
      messages: [],
      message: "",
      audiostate: true,
      screenstate: true,
      videostate: true,
      videoallowed: true,
      audioallowed: true,
      captured: "",
      cnt: false,
      previewOpen: false,
      connectionUser: [],
      userId: "guest",
      connectionId: "",
      connections: [],
      leaved: false,
      width: window.innerWidth,
      height: window.innerHeight,
      gamePanel: false,
      isRandomAllowed: false,
      cheers: false,
      gameCategory: "main",
      host: {},
      isHost: false,
    };

    this.joinSession = this.joinSession.bind(this);
    this.leaveSession = this.leaveSession.bind(this);
    this.handleChangeSessionId = this.handleChangeSessionId.bind(this);
    this.handleChangeUserName = this.handleChangeUserName.bind(this);
    this.handleMainVideoStream = this.handleMainVideoStream.bind(this);
    this.escFunction = this.escFunction.bind(this);
    this.clickLeave = this.clickLeave.bind(this);
    this.paneltoggle = this.paneltoggle.bind(this);
    // chat
    this.chattoggle = this.chattoggle.bind(this);
    this.messageContainer = createRef(null);
    this.sendmessageByClick = this.sendmessageByClick.bind(this);
    this.sendmessageByEnter = this.sendmessageByEnter.bind(this);
    this.handleChatMessageChange = this.handleChatMessageChange.bind(this);
    // 짠효과
    this.cheersToggle = this.cheersToggle.bind(this);
    // 게임
    this.setGameCategory = this.setGameCategory.bind(this);
    // 방장 나가기
    this.pubOut = this.pubOut.bind(this);
  }

  pubOut() {
    this.leaveSession();
  }

  cheersToggle() {
    this.setState({ cheers: !this.state.cheers });
    setTimeout(() => {
      this.setState({ cheers: !this.state.cheers });
    }, 6000);
  }

  escFunction(event) {
    if ((event.key === 27) | (event.which === 27)) {
      this.closeModalCapture();
      this.closeModalLeave();
      //Do whatever when esc is pressed
    }
  }

  paneltoggle() {
    this.setState({ gamePanel: !this.state.gamePanel });
  }

  handleScreenMode = () => {
    this.setState({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  };

  handleChatMessageChange(e) {
    this.setState({
      message: e.target.value,
    });
  }
  // 채팅 자동 하단 스크롤
  componentDidUpdate(previousProps, previousState) {
    if (this.refs.chatoutput != null) {
      this.refs.chatoutput.scrollTop = this.refs.chatoutput.scrollHeight;
    }
    this.showVideoControls();
  }

  chattoggle() {
    this.setState({ chaton: !this.state.chaton });
  }

  sendmessageByClick() {
    if (this.state.message !== "") {
      this.setState({
        messages: [
          ...this.state.messages,
          {
            userName: this.state.myUserName,
            text: this.state.message,
            boxClass: "messages__box--operator",
            bigBoxClass: "messages__bigBox--operator",
          },
        ],
      });
      const mySession = this.state.session;

      mySession.signal({
        data: `${this.state.myUserName},${this.state.message}`,
        to: [],
        type: "chat",
      });
    }

    this.setState({
      message: "",
    });
  }

  sendmessageByEnter(e) {
    if (e.key === "Enter") {
      if (this.state.message !== "") {
        this.setState({
          messages: [
            ...this.state.messages,
            {
              userName: this.state.myUserName,
              text: this.state.message,
              boxClass: "messages__box--operator",
              bigBoxClass: "messages__bigBox--operator",
            },
          ],
        });
        const mySession = this.state.session;

        mySession.signal({
          data: `${this.state.myUserName},${this.state.message}`,
          to: [],
          type: "chat",
        });

        this.setState({
          message: "",
        });
      }
    }
  }

  sendCaptureSignal() {
    const mySession = this.state.session;

    mySession.signal({
      data: "start capture",
      to: [],
      type: "captureSignal",
    });
  }

  sendCheersSignal() {
    const mySession = this.state.session;

    mySession.signal({
      data: "start cheers",
      to: [],
      type: "cheersSignal",
    });
  }

  sendPubOut() {
    const mySession = this.state.session;

    mySession.signal({
      data: "out put",
      to: [],
      type: "putOut",
    });
  }

  openModalCapture = () => {
    Swal.fire({
      title: "사진이 마음에 드시나요??",
      width: 1200,
      html: `<div id="preview"></div>`,
      showDenyButton: true,
      confirmButtonText: "저장하기",
      denyButtonText: `저장 안하기`,
    }).then((result) => {
      if (result.isConfirmed) {
        this.onSaveAs(
          this.state.captured.toDataURL("image/png"),
          "HomeLanDrink.png"
        );
      } else if (result.isDenied) {
        this.closeModalCapture();
      }
    });
  };

  sendGameCategorySignal() {
    const mySession = this.state.session;

    mySession.signal({
      data: this.state.gameCategory,
      to: [],
      type: "gameCategorySignal",
    });
  }

  async setGameCategory(category) {
    await this.setState({ gameCategory: category });
    await this.sendGameCategorySignal();
  }

  closeModalCapture = () => {
    this.setState({ modalOpen_capture: false });
    this.setState({ previewOpen: false });
  };

  openModalLeave = () => {
    Swal.fire({
      title: "정말 방을 떠나시겠습니까?",
      showDenyButton: true,
      confirmButtonText: "더 놀기",
      denyButtonText: `종료하기`,
    }).then((result) => {
      if (result.isDenied) {
        this.leaveSession();
        window.location.reload();
      }
    });
  };

  clickLeave = () => {
    this.closeModalLeave();
    this.leaveSession();
  };

  componentDidMount() {
    // 로그인한 유저의 정보 얻기 위한 api 요청
    const token = localStorage.getItem("jwt");
    const config = {
      Authorization: `Bearer ${token}`,
    };
    if (token) {
      axios({
        url: `${BEUrl}/api/v1/users/me`,
        method: "get",
        headers: config,
      }).then((res) => {
        this.setState({
          myUserName: res.data.nickname,
          userId: res.data.userId,
        });
      });
    }

    const constraints = { audio: true, video: true };
    navigator.mediaDevices
      .getUserMedia(constraints)
      .then(() => {
        this.setState({
          videoallowed: true,
          audioallowed: true,
        });
      })
      .catch(() => {
        this.setState({
          videoallowed: false,
          audioallowed: false,
        });
      });
    // window.addEventListener("beforeunload", this.componentWillUnmount());
    window.addEventListener("beforeunload", () => {
      this.componentWillUnmount();
    });
    window.addEventListener("resize", this.handleScreenMode);
    document.addEventListener("keydown", this.escFunction, false);
  }

  componentWillUnmount() {
    window.removeEventListener("beforeunload", this.onbeforeunload);
    document.removeEventListener("keydown", this.escFunction, false);
    window.removeEventListener("resize", this.handleScreenMode);
    window.location.reload();
    if (!this.state.leaved) {
      this.leaveSession();
    }
  }

  // onbeforeunload(event) {
  //   event.preventDefault();
  //   window.location.reload();
  //   if (!this.state.leaved) {
  //     this.leaveSession();
  //   }
  //   event.returnValue = '';
  // }

  handleChangeSessionId(e) {
    this.setState({
      mySessionId: e.target.value,
    });
  }

  handleChangeUserName(e) {
    this.setState({
      myUserName: e.target.value,
    });
  }

  handleMainVideoStream(stream) {
    if (this.state.mainStreamManager !== stream) {
      this.setState({
        mainStreamManager: stream,
      });
    }
  }

  deleteSubscriber(streamManager) {
    let subscribers = this.state.subscribers;
    let index = subscribers.indexOf(streamManager, 0);
    if (index > -1) {
      subscribers.splice(index, 1);
      this.setState({
        subscribers: subscribers,
      });
    }
  }

  joinSession() {
    // --- 1) Get an OpenVidu object ---

    this.OV = new OpenVidu();
    // --- 2) Init a session ---

    this.setState(
      {
        session: this.OV.initSession(),
      },
      () => {
        var mySession = this.state.session;

        // --- 3) Specify the actions when events take place in the session ---
        mySession.on("connectionCreated", (event) => {
          console.log("connection");
          console.log(event.connection);
          // var connection = event.connection.connectionId
          // Object형을 넣어줘야한다.
          var connection = event.connection;
          var connections = this.state.connections;
          var connectionUser = this.state.connectionUser;
          connections.push(connection);
          var userId = connection.connectionId;
          var userName = JSON.parse(connection.data).clientData;
          connectionUser.push({ userId, userName });

          //방장 찾기
          var Host = this.state.connections[0];
          var minNum = this.state.connections[0].creationTime;
          for (var i = 0; i < this.state.connections.length; i++) {
            if (minNum > this.state.connections[i].creationTime) {
              minNum = this.state.connections[i].creationTime;
              Host = this.state.connections[i];
            }
          }

          //Update
          this.setState({
            connections: connections,
            connectionUser: connectionUser,
            host: Host,
          });

          if (this.state.connectionId === this.state.host.connectionId) {
            this.setState({ isHost: true });
          } else {
            this.setState({ isHost: false });
          }
        });
        // On every new Stream received...
        mySession.on("streamCreated", (event) => {
          // Subscribe to the Stream to receive it. Second parameter is undefined
          // so OpenVidu doesn't create an HTML video by its own
          var subscriber = mySession.subscribe(event.stream, undefined);
          var subscribers = this.state.subscribers;
          subscribers.push(subscriber);

          // Update the state with the new subscribers
          this.setState({
            subscribers: subscribers,
          });
        });

        mySession.on("signal:leavedUser", (event) => {
          var leavedUserId = event.data;
          var deleteIndexUser = 9999;
          var deleteIndexConn = 9999;
          for (var i = 0; i < this.state.connectionUser.length; i++) {
            if (this.state.connectionUser[i].userId === leavedUserId) {
              deleteIndexUser = i;
            }
          }
          for (var i = 0; i < this.state.connections.length; i++) {
            if (this.state.connections[i].connectionId === leavedUserId) {
              deleteIndexConn = i;
            }
          }
          this.state.connectionUser.splice(deleteIndexUser, 1);
          this.state.connections.splice(deleteIndexConn, 1);
        });

        mySession.on("signal:chat", (event) => {
          let chatdata = event.data.split(",");
          if (chatdata[0] !== this.state.myUserName) {
            this.setState({
              messages: [
                ...this.state.messages,
                {
                  userName: chatdata[0],
                  text: chatdata[1],
                  boxClass: "messages__box--visitor",
                  bigBoxClass: "messages__bigBox--visitor",
                },
              ],
            });
          }
        });
        mySession.on("signal:captureSignal", (event) => {
          this.onCapture();
        });

        mySession.on("signal:cheersSignal", (event) => {
          this.cheersToggle();
        });

        // 방장 나가기
        mySession.on("signal:putOut", (event) => {
          this.pubOut();
        });

        mySession.on("signal:gameCategorySignal", (event) => {
          console.log("이벤트 데이터", event.data);
          this.setState({ gameCategory: event.data });
          console.log(this.state.gameCategory);
        });

        // On every Stream destroyed...
        mySession.on("streamDestroyed", (event) => {
          // Remove the stream from 'subscribers' array
          this.deleteSubscriber(event.stream.streamManager);
        });

        // On every asynchronous exception...
        mySession.on("exception", (exception) => {
          console.warn(exception);
        });

        // --- 4) Connect to the session with a valid user token ---

        // 'getToken' method is simulating what your server-side should do.
        // 'token' parameter should be retrieved and returned by your own backend
        this.getToken().then((token) => {
          // First param is the token got from OpenVidu Server. Second param can be retrieved by every user on event
          // 'streamCreated' (property Stream.connection.data), and will be appended to DOM as the user's nickname
          mySession
            .connect(token, { clientData: this.state.myUserName })
            .then(() => {
              // --- 5) Get your own camera stream ---

              // Init a publisher passing undefined as targetElement (we don't want OpenVidu to insert a video
              // element: we will manage it on our own) and with the desired properties
              let publisher = this.OV.initPublisher(undefined, {
                audioSource: undefined, // The source of audio. If undefined default microphone
                videoSource: undefined, // The source of video. If undefined default webcam
                publishAudio: true, // Whether you want to start publishing with your audio unmuted or not
                publishVideo: true, // Whether you want to start publishing with your video enabled or not
                resolution: "640x480", // The resolution of your video
                frameRate: 30, // The frame rate of your video
                insertMode: "APPEND", // How the video is inserted in the target element 'video-container'
                mirror: false, // Whether to mirror your local video or not
              });

              // --- 6) Publish your stream ---

              mySession.publish(publisher);

              // Set the main video in the page to display our webcam and store our Publisher
              this.setState({
                mainStreamManager: publisher,
                publisher: publisher,
              });
            })
            .catch((error) => {
              console.log(
                "There was an error connecting to the session:",
                error.code,
                error.message
              );
            });
        });
      }
    );
  }

  leaveSession() {
    // --- 7) Leave the session by calling 'disconnect' method over the Session object ---
    const mySession = this.state.session;
    // 컬렉션 배열에서 나간유저 제거
    mySession.signal({
      data: `${this.state.connectionId}`,
      to: [],
      type: "leavedUser",
    });

    if (mySession.connection.connectionId == this.state.host.connectionId) {
      // 여기찐
      this.sendPubOut();
    }

    // 세션 나가면 app.js에 false값 전달 => navbar 토글 위함
    const onIsSession = this.props.onIsSession;
    onIsSession(false);

    if (mySession) {
      mySession.disconnect();
    }

    // 세션이 있을 때만 leave api 전송
    if (this.state.mySessionId) {
      axios({
        url: `${BEUrl}/api/v1/room/leave/${this.state.mySessionId}`,
        method: "post",
        data: {
          nickname: this.state.myUserName,
          connectionId: this.state.connectionId,
          userId: this.state.userId,
        },
      }).then(() => {
        // Empty all properties...
        this.OV = null;

        this.setState({
          session: undefined,
          subscribers: [],
          mySessionId: "",
          myUserName: undefined,
          mainStreamManager: undefined,
          publisher: undefined,
          subscribers: [],
          messages: [],
          message: "",
          audiostate: true,
          screenstate: true,
          videostate: true,
          videoallowed: true,
          audioallowed: true,
          captured: "",
          cnt: false,
          previewOpen: false,
          connectionUser: [],
          userId: "guest",
          connectionId: "",
          connections: [],
          leaved: true,
          width: window.innerWidth,
          height: window.innerHeight,
          gamePanel: false,
          isRandomAllowed: this.state.isRandomAllowed,
          cheers: false,
          gameCategory: "main",
          host: {},
          isHost: false,
        });
      });
    }
  }

  render() {
    const messages = this.state.messages;
    const mySessionId = this.state.mySessionId;
    const myUserName = this.state.myUserName;
    const loginToken = localStorage.getItem("jwt");
    const onIsSession = this.props.onIsSession;

    // 방 랜덤입장 여부 체크
    const handleChangeRandomJoin = (event) => {
      event.preventDefault();
      this.setState({
        isRandomAllowed: event.target.value,
      });
    };

    // 방 랜덤입장 api
    const onRandomJoin = (event) => {
      event.preventDefault();
      axios({
        url: `${BEUrl}/api/v1/room/random-join`,
        method: "get",
      })
        .then((res) => {
          console.log(res);
          this.setState({
            mySessionId: res.data,
          });
        })
        .then(() => {
          onCheckNickname();
        })
        .catch((err) => {
          if (err.response.status === 404) {
            alert("개설된 방이 없습니다...ㅜㅜ");
          }
        });
    };

    const onCheckNickname = () => {
      if (!this.state.myUserName) {
        alert("닉네임을 입력해주세요.");
        this.setState({
          mySessionId: "",
        });
      } else {
        axios({
          url: `${BEUrl}/api/v1/room/join/${this.state.mySessionId}`,
          method: "post",
          data: {
            nickname: this.state.myUserName,
            connectionId: this.state.connectionId,
            userId: this.state.userId,
          },
        })
          .then((res) => {
            console.log(this.state.myUserName);
            console.log(this.state.connectionId);
            console.log(res);
            if (res.status === 226) {
              alert("중복된 닉네임입니다.");
            } else {
              onIsSession(true);
              this.joinSession();
            }
          })
          .catch((err) => {
            if (err.response.status === 406) {
              alert("방이 꽉 찼습니다...ㅜㅜ");
            }
          });
      }
    };

    const onCheckSession = (event) => {
      event.preventDefault();
      if (!this.state.mySessionId) {
        alert("방 번호를 입력해 주세요!");
      } else {
        axios({
          url: `${BEUrl}/api/v1/room/${this.state.mySessionId}`,
          method: "get",
          data: {
            roomId: this.state.mySessionId,
          },
        })
          .then(() => {
            onCheckNickname();
          })

          .catch((err) => {
            if (err.response.status === 404) {
              alert("방이 존재하지 않습니다.");
            }
          });
      }
    };

    const sendUserData = () => {
      axios({
        url: `${BEUrl}/api/v1/room/${this.state.mySessionId}`,
        method: "put",
        data: {
          userId: this.state.userId,
          nickname: this.state.myUserName,
          connectionId: this.state.connectionId,
          randomJoin: this.state.isRandomAllowed,
        },
      });
    };

    const onCreateRoom = (event) => {
      event.preventDefault();
      axios({
        url: `${BEUrl}/api/v1/room/create`,
        method: "get",
      })
        .then((res) => {
          this.setState({
            mySessionId: res.data,
          });
        })
        .then(() => {
          onIsSession(true);
          this.joinSession();
        })
        .then(() => {
          sendUserData();
        })
        .catch((err) => {
          console.log(err);
        });
    };

    const { mypage } = this.props;
    return (
      <div className="bg">
        <br></br>

        {this.state.session === undefined ? (
          <Container className="padding-100px">
            <Row>
              <Col md={{ span: 2, offset: 2 }}>
                <img src={beerL} style={{ width: 150, height: 150 }}></img>
              </Col>
              <Col md={{ span: 4 }}>
                <h1 className="color-353f71"> Welcome to </h1>
                <h1 className="color-353f71"> Home Lan Drink! </h1>
              </Col>
              <Col md={{ span: 2 }}>
                <img src={beerR} style={{ width: 150, height: 150 }}></img>
              </Col>
            </Row>
            <Row>
              <Col></Col>
              <Col xs={10}>
                <div id="join">
                  {/* <div id="img-div">
                    <img src="/HLD_logo_310x310.png" alt="OpenVidu logo" />
                  </div> */}
                  <div id="join-dialog" className="jumbotron vertical-center">
                  {this.state.videoallowed && this.state.audioallowed ? (
                    loginToken ? (
                      <form className="form-group">
                        <br></br>
                        <h2 className="color-353f71">
                          안녕하세요 '{myUserName}'님!
                        </h2>
                        <br></br>
                        <br></br>
                        <Container>
                          <Row>
                            <Col md={{ span: 3 }}>
                              <div className="join-box join-width1">
                                <div>방 만들기</div>
                                <div>
                                  <img
                                    src={E}
                                    style={{
                                      width: 100,
                                      height: 100,
                                      marginTop: 20,
                                    }}
                                  ></img>
                                </div>
                                <input
                                  className="btn join-box-inner"
                                  name="commit"
                                  type="submit"
                                  value="방 만들기"
                                  onClick={onCreateRoom}
                                />
                                <FormControl style={{ marginTop: 0 }}>
                                  <RadioGroup
                                    aria-labelledby="demo-controlled-radio-buttons-group"
                                    name="controlled-radio-buttons-group"
                                    value={this.state.isRandomAllowed}
                                    onChange={handleChangeRandomJoin}
                                  >
                                    <FormControlLabel
                                      value={false}
                                      control={<Radio />}
                                      label="랜덤입장 불가능"
                                    />
                                    <FormControlLabel
                                      value={true}
                                      control={<Radio />}
                                      label="랜덤입장 가능"
                                    />
                                  </RadioGroup>
                                </FormControl>
                              </div>
                            </Col>
                            <Col md={{ span: 3, offset: 1 }}>
                              <div className="join-box join-width1">
                                <div>방 입장하기</div>
                                <div>
                                  <img
                                    src={E2}
                                    style={{
                                      width: 100,
                                      height: 100,
                                      marginTop: 20,
                                      marginBottom: 10,
                                    }}
                                  ></img>
                                </div>
                                <p>방 번호를 입력하세요</p>
                                <div className="input-group">
                                  <input
                                    type="text"
                                    className="form-control margin-left10"
                                    placeholder="방 번호"
                                    value={mySessionId}
                                    onChange={this.handleChangeSessionId}
                                  />
                                  <input
                                    type="submit"
                                    value="JOIN"
                                    className="btn btn-lg btn-color margin-right10"
                                    onClick={onCheckSession}
                                  />
                                </div>
                              </div>
                            </Col>
                            <Col md={{ span: 3, offset: 1 }}>
                              <div className="join-box join-width1">
                                <div>랜덤방 입장하기</div>
                                <br></br>
                                <div>
                                  <img
                                    src={Q}
                                    style={{
                                      width: 100,
                                      height: 100,
                                    }}
                                  ></img>
                                </div>
                                <input
                                  className="btn join-box-inner"
                                  name="commit"
                                  type="submit"
                                  value="입장하기"
                                  onClick={onRandomJoin}
                                />
                              </div>
                            </Col>
                          </Row>
                        </Container>
                      </form>
                    ) : (
                      <form className="form-group">
                        <br></br>
                        <h2 className="color-353f71">안녕하세요 게스트님!</h2>
                        <br></br>
                        <br></br>
                        <Container>
                          <Row>
                            <Col md={{ span: 4, offset: 1 }}>
                              <div className="join-box join-width2">
                                <br></br>
                                <h2 className="font-join">방에 참가하기</h2>
                                <br></br>
                                <p className="color-353f71">
                                  닉네임을 입력해주세요.{" "}
                                </p>
                                <input
                                  className="form-control input-style"
                                  type="text"
                                  id="userName"
                                  value={myUserName}
                                  onChange={this.handleChangeUserName}
                                  placeholder="닉네임"
                                  required
                                />
                                <br></br>
                                <p> 방번호를 입력해주세요. </p>
                                <input
                                  className="form-control input-style"
                                  type="text"
                                  id="sessionId"
                                  value={mySessionId}
                                  onChange={this.handleChangeSessionId}
                                  placeholder="방 번호"
                                  required
                                />
                                <p className="text-center">
                                  <br></br>
                                  <input
                                    className="btn btn-lg btn-color"
                                    name="commit"
                                    type="submit"
                                    value="JOIN"
                                    onClick={onCheckSession}
                                  />
                                </p>
                              </div>
                            </Col>
                            <Col md={{ span: 4, offset: 2 }}>
                              <div className="join-box join-width2">
                                <br></br>
                                <h2 className="font-join">랜덤방 참가하기</h2>

                                <div>
                                  <img
                                    src={Q}
                                    style={{
                                      width: 80,
                                      height: 80,
                                      marginTop: 10,
                                    }}
                                  ></img>
                                </div>
                                <br></br>
                                <p className="color-353f71">
                                  닉네임을 입력해주세요.{" "}
                                </p>
                                <input
                                  className="form-control input-style"
                                  type="text"
                                  id="userName"
                                  value={myUserName}
                                  onChange={this.handleChangeUserName}
                                  placeholder="닉네임"
                                  required
                                />

                                <br></br>
                                <input
                                  className="btn btn-lg btn-color"
                                  name="commit"
                                  type="submit"
                                  value="RANDOM JOIN"
                                  onClick={onRandomJoin}
                                />
                              </div>
                            </Col>
                          </Row>
                        </Container>
                      </form>
                    )
                  ) : (
                    <form className="form-group">
                      <br></br>
                      <h2 className="color-353f71">디바이스 접근을 허용해 주세요!!!</h2>
                      <h2 className="color-353f71">좌측 상단 좌물쇠 모양 Click!!!</h2>
                      <br></br>
                      <br></br>
                      <div><img src={PermissionIMG} width='430px' height='430px'></img></div>    
                    </form>
                  )}
                </div>
              </div>
            </Col>
            <Col></Col>
          </Row>
          <br></br>
          <br></br>
        </Container>
        ) : (
          <div id="session">
            <Container>
              <Row>
                <Col md={{ span: 9 }} id="capture_screen">
                  {/* screens */}
                  <div id="video-container" className="video-container ">
                    {this.state.publisher !== undefined ? (
                      <div
                        // className="stream-container-v1"
                        className={
                          this.state.connectionUser.length <= 4
                            ? "stream-container-v1"
                            : "stream-container-v2"
                        }
                        onClick={() => {
                          this.videoplay();
                        }}
                      >
                        <UserVideoComponent
                          streamManager={this.state.publisher}
                        />
                        {/* <h1>방장</h1> 짠효과 */}
                        {this.state.cheers === true ? (
                          <Cheersmain></Cheersmain>
                        ) : null}
                      </div>
                    ) : null}
                    {this.state.subscribers.map((sub, i) => (
                      <div
                        key={i}
                        className={
                          this.state.connectionUser.length <= 4
                            ? "stream-container-v1"
                            : "stream-container-v2"
                        }
                        onClick={() => {
                          this.videoplay();
                        }}
                      >
                        <UserVideoComponent streamManager={sub} />
                        {/* <h1>스크라이버 짠효과</h1> */}
                        {this.state.cheers === true ? (
                          <Cheersmain></Cheersmain>
                        ) : null}
                      </div>
                    ))}
                  </div>

                  {/* 짠효과 중앙 */}
                  {/* {this.state.cheers === true ? (
                    <Cheersmain></Cheersmain>
                  ) : null} */}
                </Col>

                <Col md={{ span: 3 }}>
                  {/* gamePanel */}
                  <GamePanel
                    cnt={this.state.cnt}
                    gamePanel={this.state.gamePanel}
                    gameCategory={this.state.gameCategory}
                    setGameCategory={this.setGameCategory}
                    sessionData={this.state.sessionData}
                    mySessionId={this.state.mySessionId}
                    myUserName={this.state.myUserName}
                    session={this.state.session}
                    publisher={this.state.publisher}
                    subscribers={this.state.subscribers}
                    connectionId={this.state.connectionId}
                    connections={this.state.connections}
                    connectionUser={this.state.connectionUser}
                    host={this.state.host}
                    isHost={this.state.isHost}
                  ></GamePanel>
                  {/* chat */}
                  <div>
                    <div
                      // className="chatbox__support chat-height-with-panel"
                      className={
                        this.state.gamePanel
                          ? "chatbox__support chat-height-with-panel"
                          : "chatbox__support chat-height-without-panel"
                      }
                    >
                      <div className="chatbox__header">
                        방코드: {mySessionId}
                        <IoCopy
                          color="#50468c"
                          size="18"
                          className="cursor-pointer"
                          onClick={() =>
                            navigator.clipboard.writeText(mySessionId)
                          }
                          data-tip
                          data-for="tooltip"
                        />
                        <ReactTooltip
                          id="tooltip"
                          effect="solid"
                          place="top"
                          type="dark"
                        >
                          Copy
                        </ReactTooltip>
                      </div>

                      <div className="chatbox__messages" ref="chatoutput">
                        {/* {this.displayElements} */}
                        <Messages messages={messages} />
                        <div />
                      </div>
                      <div className="chatbox__footer">
                        <input
                          id="chat_message"
                          type="text"
                          placeholder="Write a message..."
                          onChange={this.handleChatMessageChange}
                          onKeyPress={this.sendmessageByEnter}
                          value={this.state.message}
                        />
                        <button
                          className="chatbox__send--footer"
                          onClick={this.sendmessageByClick}
                        >
                          Enter
                        </button>
                      </div>
                    </div>
                  </div>
                </Col>
              </Row>
              <Row className="btn_toolbar">
                <Col md={{ span: 6, offset: 3 }}>
                  <Row>
                    <Col>
                      {this.state.audiostate ? (
                        <div>
                          <IoMicSharp
                            color={icon_color}
                            size={btn_size}
                            onClick={() => {
                              this.state.publisher.publishAudio(
                                !this.state.audiostate
                              );
                              this.setState({
                                audiostate: !this.state.audiostate,
                              });
                            }}
                          />
                          <p className="btn-font">음소거</p>
                        </div>
                      ) : (
                        <div>
                          <IoMicOffSharp
                            color={icon_color_off}
                            size={btn_size}
                            onClick={() => {
                              this.state.publisher.publishAudio(
                                !this.state.audiostate
                              );
                              this.setState({
                                audiostate: !this.state.audiostate,
                              });
                            }}
                          />
                          <p className="btn-font">음소거 해제</p>
                        </div>
                      )}
                    </Col>
                    <Col>
                      {this.state.videostate ? (
                        <div>
                          <IoVideocam
                            color={icon_color}
                            size={btn_size}
                            onClick={() => {
                              this.state.publisher.publishVideo(
                                !this.state.videostate
                              );
                              this.setState({
                                videostate: !this.state.videostate,
                              });
                            }}
                          />
                          <p className="btn-font">비디오 끄기</p>
                        </div>
                      ) : (
                        <div>
                          <IoVideocamOff
                            color={icon_color_off}
                            size={btn_size}
                            onClick={() => {
                              this.state.publisher.publishVideo(
                                !this.state.videostate
                              );
                              this.setState({
                                videostate: !this.state.videostate,
                              });
                            }}
                          />
                          <p className="btn-font">비디오 켜기</p>
                        </div>
                      )}
                    </Col>
                    <Col>
                      {/* 짠효과 */}
                      <div>
                        <IoBeer
                          color="orange"
                          size={btn_size}
                          onClick={() => {
                            this.sendCheersSignal();
                          }}
                        />
                        <p className="btn-font">건배</p>
                      </div>
                    </Col>
                    <Col>
                      <div>
                        <IoCameraSharp
                          color={icon_color}
                          size={btn_size}
                          onClick={() => {
                            if (!this.state.isHost) {
                              return;
                            } else {
                              this.sendCaptureSignal();
                            }
                          }}
                        />
                        <p className="btn-font">사진찍기</p>
                      </div>
                    </Col>
                    <Col>
                      <div>
                        <IoGameController
                          color="green"
                          size={btn_size}
                          onClick={this.paneltoggle}
                        />
                        <p className="btn-font">게임</p>
                      </div>
                    </Col>
                    <Col>
                      {!(
                        screen.width === this.state.width &&
                        screen.height === this.state.height
                      ) ? (
                        <div>
                          <IoMdExpand
                            color={icon_color}
                            size={btn_size}
                            onClick={() => {
                              this.openFullScreenMode();
                            }}
                          />
                          <p className="btn-font">전체화면</p>
                        </div>
                      ) : (
                        <div>
                          <IoMdContract
                            color={icon_color_off}
                            size={btn_size}
                            onClick={() => {
                              this.closeFullScreenMode();
                            }}
                          />
                          <p className="btn-font">전체화면 해제</p>
                        </div>
                      )}
                    </Col>

                    <Col>
                      <div>
                        <IoExit
                          color="red"
                          size={btn_size}
                          onClick={this.openModalLeave}
                        />
                        <p className="btn-font">나가기</p>
                      </div>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </Container>
          </div>
        )}
      </div>
    );
  }

  /**
   * --------------------------
   * SERVER-SIDE RESPONSIBILITY
   * --------------------------
   * These methods retrieve the mandatory user token from OpenVidu Server.
   * This behavior MUST BE IN YOUR SERVER-SIDE IN PRODUCTION (by using
   * the API REST, openvidu-java-client or openvidu-node-client):
   *   1) Initialize a Session in OpenVidu Server	(POST /openvidu/api/sessions)
   *   2) Create a Connection in OpenVidu Server (POST /openvidu/api/sessions/<SESSION_ID>/connection)
   *   3) The Connection.token must be consumed in Session.connect() method
   */

  getToken() {
    return this.createSession(this.state.mySessionId).then((sessionId) =>
      this.createToken(sessionId)
    );
  }

  createSession(sessionId) {
    return new Promise((resolve, reject) => {
      var data = JSON.stringify({ customSessionId: sessionId });
      axios
        .post(OPENVIDU_SERVER_URL + "/openvidu/api/sessions", data, {
          headers: {
            Authorization:
              "Basic " + btoa("OPENVIDUAPP:" + OPENVIDU_SERVER_SECRET),
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          console.log("CREATE SESION", response);
          resolve(response.data.id);
        })
        .catch((response) => {
          var error = Object.assign({}, response);
          if (error?.response?.status === 409) {
            resolve(sessionId);
          } else {
            console.log(error);
            console.warn(
              "No connection to OpenVidu Server. This may be a certificate error at " +
                OPENVIDU_SERVER_URL
            );
            if (
              window.confirm(
                'No connection to OpenVidu Server. This may be a certificate error at "' +
                  OPENVIDU_SERVER_URL +
                  '"\n\nClick OK to navigate and accept it. ' +
                  'If no certificate warning is shown, then check that your OpenVidu Server is up and running at "' +
                  OPENVIDU_SERVER_URL +
                  '"'
              )
            ) {
              window.location.assign(
                OPENVIDU_SERVER_URL + "/accept-certificate"
              );
            }
          }
        });
    });
  }

  createToken(sessionId) {
    return new Promise((resolve, reject) => {
      var data = {};
      axios
        .post(
          OPENVIDU_SERVER_URL +
            "/openvidu/api/sessions/" +
            sessionId +
            "/connection",
          data,
          {
            headers: {
              Authorization:
                "Basic " + btoa("OPENVIDUAPP:" + OPENVIDU_SERVER_SECRET),
              "Content-Type": "application/json",
            },
          }
        )
        .then((response) => {
          console.log("TOKEN", response);
          this.setState({
            connectionId: response.data.connectionId,
          });
          resolve(response.data.token);
        })
        .catch((error) => reject(error));
    });
  }
  // 전체화면 설정
  openFullScreenMode() {
    console.log("fullscreen");
    if (document.documentElement.requestFullscreen)
      document.documentElement.requestFullscreen();
    else if (document.webkitRequestFullscreen)
      // Chrome, Safari (webkit)
      document.documentElement.webkitRequestFullscreen();
    else if (document.mozRequestFullScreen)
      // Firefox
      document.documentElement.mozRequestFullScreen();
    else if (document.msRequestFullscreen)
      // IE or Edge
      document.documentElement.msRequestFullscreen();
  }
  // 전체화면 해제
  closeFullScreenMode() {
    console.log("closefullscreen");
    if (document.exitFullscreen) document.exitFullscreen();
    else if (document.webkitExitFullscreen)
      // Chrome, Safari (webkit)
      document.webkitExitFullscreen();
    else if (document.mozCancelFullScreen)
      // Firefox
      document.mozCancelFullScreen();
    else if (document.msExitFullscreen)
      // IE or Edge
      document.msExitFullscreen();
  }

  onCapture() {
    console.log("onCapture");
    const gamePanelState = this.state.gamePanel;
    if (!this.state.previewOpen && !this.state.cnt) {
      this.setState({ cnt: true, previewOpen: true, gamePanel: true });
      setTimeout(() => {
        {
          html2canvas(document.getElementById("capture_screen")).then(
            (canvas) => {
              this.state.captured = canvas;
              this.openModalCapture();
              document.getElementById("preview").appendChild(canvas);
            }
          );
          this.setState({ cnt: false, gamePanel: gamePanelState });
        }
      }, 6000);
    }
  }

  onSaveAs(uri, filename) {
    console.log("onSaveAs");
    var link = document.createElement("a");
    document.body.appendChild(link);
    link.href = uri;
    link.download = filename;
    link.click();
    document.body.removeChild(link);
    setTimeout(() => {
      this.closeModalCapture();
    }, 500);
  }
  showVideoControls() {
    var video = document.getElementsByTagName("video");
    for (var i = 0; i < video.length; i++) {
      video[i].controls = true;
    }
  }

  videoplay() {
    var video = document.getElementsByTagName("video");
    setTimeout(() => {
      for (var i = 0; i < video.length; i++) {
        video[i].play();
      }
    }, 100);
  }
}

export default Main;
