import axios from "axios";
import { OpenVidu } from "openvidu-browser";
import React, { Component } from "react";
import UserVideoComponent from "../../components/Openvidu/UserVideo";
import Chat from "../../components/Openvidu/Chat";
import styles from "./GameOpenvidu.module.css";
import { useEffect, useState } from "react";
import ArrowForwardIosRoundedIcon from "@mui/icons-material/ArrowForwardIosRounded";
import Test from "../../components/Audio/Test";

import card40 from "../../images/cards/card_back_logo.png";
import ruby_win from "../../images/ruby/ruby_win.gif";
import ruby_bet from "../../images/ruby/ruby_bet.gif";
import ruby_get from "../../images/ruby/ruby_get.gif";
import ReactDOM from "react-dom";
import Popover from "react-popover";
import HelpOutlineRoundedIcon from "@mui/icons-material/HelpOutlineRounded";
import ruby from "../../images/icon/ruby.png";
import ArrowUpwardRoundedIcon from "@mui/icons-material/ArrowUpwardRounded";
import ArrowDownwardRoundedIcon from "@mui/icons-material/ArrowDownwardRounded";
import { toHaveDisplayValue } from "@testing-library/jest-dom/dist/matchers";

const OPENVIDU_SERVER_URL = "https://" + "i7a404.p.ssafy.io" + ":8443";
const OPENVIDU_SERVER_SECRET = "MY_SECRET";

class Gameroom extends Component {
  constructor(props) {
    super(props);

    this.state = {
      // 방 입장 시 Game에서 닉네임이랑 방정보 받아와야 한다. ***********수정
      mySessionId: this.props.roomId,
      myUserName: "",
      session: undefined,
      mainStreamManager: undefined,
      publisher: undefined,
      subscribers: [],
      players: [],
      setPlayers: [],
      number: 0,
      chatList: [],
      isOpen: false,
      currentBetUnit: 0,
      raiseCnt: this.props.currentBetUnit,
    };

    this.test = [styles.player1, styles.player2, styles.player3, styles.player4, styles.player5];

    let roomid = props.mySessionId;

    this.joinSession = this.joinSession.bind(this);
    this.leaveSession = this.leaveSession.bind(this);
    this.switchCamera = this.switchCamera.bind(this);
    this.handleChangeSessionId = this.handleChangeSessionId.bind(this);
    this.handleChangeUserName = this.handleChangeUserName.bind(this);
    this.handleMainVideoStream = this.handleMainVideoStream.bind(this);
    this.onbeforeunload = this.onbeforeunload.bind(this);
    this.sendMessage = this.sendMessage.bind(this);
    this.sendChat = this.sendChat.bind(this);
    this.disconnectStomp = this.disconnectStomp.bind(this);
  }

  togglePopover = () => {
    this.setState({ isOpen: !this.state.isOpen });
  };

  increase = () => {
    this.setState({
      number: this.state.number + 1,
    });
    console.log(this.state.number);
  };

  componentDidMount() {
    this.joinSession();
    window.addEventListener("beforeunload", this.onbeforeunload);
  }

  componentWillUnmount() {
    window.removeEventListener("beforeunload", this.onbeforeunload);
    const mySession = this.state.session;

    if (mySession) {
      mySession.disconnect();
    }
    this.state.session.unpublish(this.state.mainStreamManager);
  }

  onbeforeunload(event) {
    this.leaveSession();
  }

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
    this.OV = new OpenVidu();

    this.setState(
      {
        session: this.OV.initSession(),
      },
      () => {
        var mySession = this.state.session;
        mySession.on("streamCreated", (event) => {
          var subscriber = mySession.subscribe(event.stream, undefined);
          var subscribers = this.state.subscribers;
          subscribers.push(subscriber);

          console.log("subscriber joined : ");

          let tempsubarr = [];

          for (let i = 0; i < this.props.players.length; i++) {
            for (let j = 0; j < subscribers.length; j++) {
              let username = JSON.parse(subscribers[j].stream.connection.data).clientData;
              if (this.props.players[i].nickname == username) {
                console.log(this.props.players[i].nickname);
                console.log(username);
                tempsubarr.push(subscribers[j]);
              }
            }
          }
          console.log(subscribers);
          console.log(this.props.players);
          console.log(this.props.win);

          this.setState({
            subscribers: tempsubarr,
          });
        });

        mySession.on("signal:my-chat", (event) => {
          const message = event.data.split(":");
          const chatmsg = { name: message[0], msg: message[1] };
          console.log("event.date print:" + event.data);
          console.log("event print:" + event);
          console.log(event);
          var chatList = this.state.chatList.concat(chatmsg);
          console.log("chatlist print: " + this.state.chatList);
          console.log(this.state.chatList);
          this.setState({
            chatList: chatList,
          });
        });

        mySession.on("streamDestroyed", (event) => {
          console.log("stream destroyed : " + event.stream.streamManager);

          this.deleteSubscriber(event.stream.streamManager);
          //재정렬
        });

        mySession.on("exception", (exception) => {
          console.warn(exception);
        });

        this.getToken().then((token) => {
          mySession
            .connect(token, { clientData: this.props.players[0].nickname })
            .then(async () => {
              var devices = await this.OV.getUserMedia({
                audio: true,
                video: true,
              });
              // var videoDevices = devices.filter(device => device.kind === 'videoinput');

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
                // currentVideoDevice: videoDevices[0],
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
              this.disconnectStomp()
            });
        });
      }
    );
  }

  leaveSession() {
    if (window.confirm("나가시겠습니까?") == true) {
      console.log("나가기 누름");
      const mySession = this.state.session;

      if (mySession) {
        mySession.disconnect();
      }

      this.OV = null;
      this.setState({
        session: undefined,
        subscribers: [],
        mainStreamManager: undefined,
        publisher: undefined,
      });
      this.disconnectStomp();
      // this.props.leavegame();
    }
  }

  disconnectStomp() {
    this.props.stomp.send(
      "/pub/game/message",
      {},
      JSON.stringify({
        roomId: this.props.roomId,
        message: "",
        sender: "",
        type: "EXIT",
        socketId: this.props.sessionId,
      })
    );
    this.props.navigate("../lobby/rooms");
  }

  // 채팅 메세지 부분
  sendMessage(type, data) {
    const mySession = this.state.session;
    console.log(this.state.mainStreamManager);
    console.log(this.state.publisher);
    console.log(this.state.subscribers);
    mySession.signal({
      data: data,
      to: [],
      type: type,
    });
  }
  sendChat(msg) {
    var chatMsg = this.props.players[0].nickname + " : " + msg;
    this.sendMessage("my-chat", chatMsg);
  }

  async switchCamera() {
    try {
      const devices = await this.OV.getDevices();
      var videoDevices = devices.filter((device) => device.kind === "videoinput");

      if (videoDevices && videoDevices.length > 1) {
        var newVideoDevice = videoDevices.filter(
          (device) => device.deviceId !== this.state.currentVideoDevice.deviceId
        );

        if (newVideoDevice.length > 0) {
          var newPublisher = this.OV.initPublisher(undefined, {
            videoSource: newVideoDevice[0].deviceId,
            publishAudio: true,
            publishVideo: true,
            mirror: true,
          });

          await this.state.session.unpublish(this.state.mainStreamManager);

          await this.state.session.publish(newPublisher);
          this.setState({
            currentVideoDevice: newVideoDevice,
            mainStreamManager: newPublisher,
            publisher: newPublisher,
          });
        }
      }
    } catch (e) {
      console.error(e);
    }
  }

  raiseChange(change) {
    let raise = this.state.raiseCnt;
    if (change == "up") {
      this.setState({
        raiseCnt: parseInt(parseInt(this.state.raiseCnt) + parseInt(this.props.currentBetUnit)),
      });
      raise = parseInt(parseInt(raise) + parseInt(this.props.currentBetUnit));
    } else {
      this.setState({
        raiseCnt: parseInt(parseInt(this.state.raiseCnt) - parseInt(this.props.currentBetUnit)),
      });
      raise = parseInt(parseInt(raise) - parseInt(this.props.currentBetUnit));
    }
    this.props.setMyBetAmount(change, raise);
  }

  sendBetting(action) {
    console.log(action);
    this.props.sendBet(action);
    this.setState({
      raiseCnt: this.props.currentBetUnit,
    });
  }

  render() {
    const chatList = this.state.chatList;
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <h1>
            <ArrowForwardIosRoundedIcon className={styles.icon} />
            {this.props.roomTitle}
          </h1>
          <h2>기본 베팅 {this.props.currentBetUnit} 루비</h2>
          <div className={styles.buttonList}>
            <button className={styles.button} onClick={this.leaveSession}>
              나가기
            </button>
          </div>
        </div>
        {this.state.session !== undefined ? (
          <div className={styles.grid}>
            {this.state.publisher && this.props.roomInfo && this.props.players[0] ? (
              <div
                onClick={() => this.handleMainVideoStream(this.state.publisher)}
                className={`${styles.myCam} ${
                  this.props.turn == 0 ? styles.highlight : styles.none
                }`}
              >
                <UserVideoComponent
                  streamManager={this.state.publisher}
                  player={this.props.players[0]}
                  number={0}
                  preaction={this.props.preaction[0]}
                  isStart={this.props.isStart}
                />
              </div>
            ) : null}

            {this.props.players[1] && this.state.subscribers[0] ? (
              <div
                key={0}
                className={`${this.test[0]} ${
                  this.props.turn == 1 ? styles.highlight : styles.none
                }`}
              >
                <UserVideoComponent
                  streamManager={this.state.subscribers[0]}
                  player={this.props.players[1]}
                  win={this.props.win[1]}
                  preaction={this.props.preaction[1]}
                  isStart={this.props.isStart}
                />
              </div>
            ) : null}
            {this.props.players[2] && this.state.subscribers[1] ? (
              <div
                key={1}
                className={`${this.test[1]} ${
                  this.props.turn == 2 ? styles.highlight : styles.none
                }`}
              >
                <UserVideoComponent
                  streamManager={this.state.subscribers[1]}
                  player={this.props.players[2]}
                  win={this.props.win[2]}
                  preaction={this.props.preaction[2]}
                  isStart={this.props.isStart}
                />
              </div>
            ) : null}
            {this.props.players[3] && this.state.subscribers[2] ? (
              <div
                key={2}
                className={`${this.test[2]} ${
                  this.props.turn == 3 ? styles.highlight : styles.none
                }`}
              >
                <UserVideoComponent
                  streamManager={this.state.subscribers[2]}
                  player={this.props.players[3]}
                  win={this.props.win[3]}
                  preaction={this.props.preaction[3]}
                  isStart={this.props.isStart}
                />
              </div>
            ) : null}
            {this.props.players[4] && this.state.subscribers[3] ? (
              <div
                key={3}
                className={`${this.test[3]} ${
                  this.props.turn == 4 ? styles.highlight : styles.none
                }`}
              >
                <UserVideoComponent
                  streamManager={this.state.subscribers[3]}
                  player={this.props.players[4]}
                  win={this.props.win[4]}
                  preaction={this.props.preaction[4]}
                  isStart={this.props.isStart}
                />
              </div>
            ) : null}
            {this.props.players[5] && this.state.subscribers[4] ? (
              <div
                key={4}
                className={`${this.test[4]} ${
                  this.props.turn == 5 ? styles.highlight : styles.none
                }`}
              >
                <UserVideoComponent
                  streamManager={this.state.subscribers[4]}
                  player={this.props.players[5]}
                  win={this.props.win[5]}
                  preaction={this.props.preaction[5]}
                  isStart={this.props.isStart}
                />
              </div>
            ) : null}

            <div className={styles.center}>
              <div className={styles.qs}>{this.props.mainMessage}</div>
              {this.props.isStart ? (
                <div className={styles.cards}>
                  <div className={`${styles.cards_back} ${styles.flip_back}`}>
                    <img src={card40} />
                    <img src={card40} />
                  </div>
                  <div className={`${styles.cards_front} ${styles.flip_front}`}>
                    <img src={"/images/cards/" + this.props.groundCard1 + ".png"} />
                    <img src={"/images/cards/" + this.props.groundCard2 + ".png"} />
                  </div>
                </div>
              ) : null}

              {/* 베팅시*/}
              {/* <img src={ruby_bet} className={styles.rubyBet}/> */}
              {/* 내가 게임 이길시*/}
              {/* <img src={ruby_win} className={styles.rubyWin}/> */}
              <div className={styles.info}>
                <div className={styles.time}></div>
                <div className={styles.ruby}>
                  <img src={ruby} className={styles.rubyImg} />
                  {this.props.win[0] ? <img src={ruby_win} className={styles.rubyWin} /> : null}
                  <p className={styles.rubyNum}>
                    {this.props.gameTotalBet == null
                      ? this.props.gameTotalBet
                      : this.props.gameTotalBet.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                  </p>
                </div>
                <div className={styles.help}>
                  <Popover
                    isOpen={this.state.isOpen}
                    body={
                      <div className={styles.popover}>
                        더블 &#60; 스트레이트 &#60; 트리플
                        <br />
                        자수정 &#60; 아쿠아마린 &#60; 다이아몬드 &#60; 에메랄드
                      </div>
                    }
                    onOuterAction={this.togglePopover}
                  >
                    <HelpOutlineRoundedIcon
                      className={styles.popoverBtn}
                      onClick={this.togglePopover}
                    />
                  </Popover>
                </div>
              </div>
            </div>
            <div className={styles.chat}>
              <Chat sendChat={this.sendChat} chatList={chatList} />
            </div>
            {/* 게임시작버튼 */}
            {this.props.isStart ? (
              <div className={this.props.turn == 0 ? styles.betting : styles.unBetting}>
                <button
                  onClick={(action) => {
                    this.sendBetting(action);
                  }}
                  disabled={this.props.buttonDisable[0]}
                >
                  다이
                </button>
                <button
                  onClick={(action) => {
                    this.sendBetting(action);
                  }}
                  disabled={this.props.buttonDisable[1]}
                >
                  콜({this.props.currentMaxBet - this.props.players[0].mytotalBet})
                </button>

                <div className={styles.raiseAmountArea}>
                  <div className={styles.raiseNum}>
                    {this.state.raiseCnt <
                    this.props.players[0].myruby - (this.props.currentMaxBet - this.props.myBet) ? (
                      <button
                        className={styles.raiseNumUp}
                        id="up"
                        onClick={() => {
                          this.raiseChange("up");
                        }}
                      >
                        <ArrowUpwardRoundedIcon />
                      </button>
                    ) : null}
                    <div className={styles.raiseNumCenter}>{this.state.raiseCnt}</div>
                    {this.props.currentBetUnit * 2 <= this.state.raiseCnt ? (
                      <button
                        className={styles.raiseNumDown}
                        id="down"
                        onClick={() => {
                          this.raiseChange("down");
                        }}
                      >
                        <ArrowDownwardRoundedIcon />
                      </button>
                    ) : null}
                  </div>
                  <button
                    className={styles.raise}
                    onClick={(action) => {
                      this.sendBetting(action);
                    }}
                    disabled={this.props.buttonDisable[2]}
                  >
                    레이즈
                  </button>
                </div>
                <button
                  onClick={(action) => {
                    this.sendBetting(action);
                  }}
                  disabled={this.props.buttonDisable[3]}
                >
                  올인
                </button>
              </div>
            ) : (
              <div className={this.props.turn == 0 ? styles.start : styles.unStart}>
                <button onClick={this.props.gameStart} disabled={this.props.startDisabled}>
                  게임시작
                </button>
              </div>
            )}
          </div>
        ) : null}
      </div>
    );
  }

  getToken() {
    return this.createSession("room" + this.props.roomId).then((sessionId) =>
      this.createToken(sessionId)
    );
  }

  createSession(sessionId) {
    return new Promise((resolve, reject) => {
      var data = JSON.stringify({ customSessionId: sessionId });
      axios
        .post(OPENVIDU_SERVER_URL + "/openvidu/api/sessions", data, {
          headers: {
            Authorization: "Basic " + btoa("OPENVIDUAPP:" + OPENVIDU_SERVER_SECRET),
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
              window.location.assign(OPENVIDU_SERVER_URL + "/accept-certificate");
            }
          }
        });
    });
  }

  createToken(sessionId) {
    return new Promise((resolve, reject) => {
      var data = {};
      axios
        .post(OPENVIDU_SERVER_URL + "/openvidu/api/sessions/" + sessionId + "/connection", data, {
          headers: {
            Authorization: "Basic " + btoa("OPENVIDUAPP:" + OPENVIDU_SERVER_SECRET),
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          console.log("TOKEN", response);
          resolve(response.data.token);
        })
        .catch((error) => reject(error));
    });
  }
}

export default Gameroom;
