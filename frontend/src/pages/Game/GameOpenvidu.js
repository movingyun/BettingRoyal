import axios from "axios";
import { OpenVidu } from "openvidu-browser";
import React, { Component } from "react";
import UserVideoComponent from "../../components/Openvidu/UserVideo";
import Chat from "../../components/Openvidu/Chat";
import styles from "./GameOpenvidu.module.css";
import { useEffect, useState } from "react";
import ArrowForwardIosRoundedIcon from "@mui/icons-material/ArrowForwardIosRounded";
import card_am_1 from "../../images/cards/card_am_1.png";
import card_aq_1 from "../../images/cards/card_aq_1.png";
import card_back from "../../images/cards/card_back_logo.png";
import ruby_win from "../../images/ruby/ruby_win.gif";
import ruby_bet from "../../images/ruby/ruby_bet.gif";
import ruby_get from "../../images/ruby/ruby_get.gif";
import ReactDOM from "react-dom";
import Popover from "react-popover";
import HelpOutlineRoundedIcon from "@mui/icons-material/HelpOutlineRounded";
import ruby from "../../images/icon/ruby.png";

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
      seconds: 30,
      myBet:0,
      currentBetUnit:0,
      buttonDisable: [true,true,true,true],
      startDisabled:false,
      isStart:false,
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
    this.sendBet = this.sendBet.bind(this)
    this.gameStart = this.gameStart.bind(this)
    // this.updateChat = this.updateChat.bind(this);
    this.startClick = this.startClick.bind(this);
  }

  startClick() {
    console.log("겜시작");
    this.timerId = setInterval(() => {
      this.setState({
        seconds: this.state.seconds - 1,
      });
    }, 1000);
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

        // On every new Stream received...
        mySession.on("streamCreated", (event) => {
          // Subscribe to the Stream to receive it. Second parameter is undefined
          // so OpenVidu doesn't create an HTML video by its own
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
          //   console.log(JSON.stringify(this.props.players))

          //   let subarr = [];
          //   let playerarr=[];
          //   for (let i = 0; i < this.state.subscribers.length; i++) {
          //     subarr.push(JSON.stringify(this.state.subscribers[i]))
          //     playerarr.push(this.props.player[i+1].nickname)
          //   }
          //   console.log(subarr)
          //   console.log(playerarr)
          // const message = event

          // Update the state with the new subscribers
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
          // this.updateChat(chatList)
          this.setState({
            chatList: chatList,
          });
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
            .connect(token, { clientData: this.props.players[0].nickname })
            .then(async () => {
              var devices = await this.OV.getDevices();
              var videoDevices = devices.filter((device) => device.kind === "videoinput");

              // --- 5) Get your own camera stream ---

              // Init a publisher passing undefined as targetElement (we don't want OpenVidu to insert a video
              // element: we will manage it on our own) and with the desired properties
              let publisher = this.OV.initPublisher(undefined, {
                audioSource: undefined, // The source of audio. If undefined default microphone
                videoSource: videoDevices[0].deviceId, // The source of video. If undefined default webcam
                publishAudio: true, // Whether you want to start publishing with your audio unmuted or not
                publishVideo: true, // Whether you want to start publishing with your video enabled or not
                resolution: "640x480", // The resolution of your video
                frameRate: 30, // The frame rate of your video
                insertMode: "APPEND", // How the video is inserted in the target element 'video-container'
                mirror: false, // Whether to mirror your local video or not
                nickname: this.props.players[0].nickname,
              });

              // --- 6) Publish your stream ---

              mySession.publish(publisher);

              // Set the main video in the page to display our webcam and store our Publisher
              this.setState({
                currentVideoDevice: videoDevices[0],
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

    if (window.confirm("나가시겠습니까?") == true) {
      console.log("나가기 누름");
      const mySession = this.state.session;
      this.props.leavegame();
      if (mySession) {
        mySession.disconnect();
      }

      // Empty all properties...
      this.OV = null;
      this.setState({
        session: undefined,
        subscribers: [],
        mySessionId: "SessionA",
        myUserName: "Participant" + Math.floor(Math.random() * 100),
        mainStreamManager: undefined,
        publisher: undefined,
      });
    }
  }

  gameStart(e) {
    if (this.props.turn == 0) {
      console.log("겜시작");
      this.setState({
        isStart:true
      })

      this.props.stomp.send(
        "/pub/game/message",
        {},
        JSON.stringify({ roomId: this.props.roomId, message: "", sender: "", type: "START" })
      );
    } else {
      console.log("방장만 시작 가능");
    }

    // // 타이머 시작
    // timerId.current = setInterval(() => {
    //   setSec(time.current-1);
    //   time.current -= 1;
    // }, 1000);

    // return () => clearInterval(timerId.current);
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
    var chatMsg = this.state.myUserName + " : " + msg;
    this.sendMessage("my-chat", chatMsg);
  }

  sendBet(action) {
    //call die raise allin
    console.log(action.target.textContent);
    switch (action.target.textContent) {
      case "콜":
        console.log("z");
        this.props.stomp.send(
          "/pub/game/message",
          {},
          JSON.stringify({
            roomId: this.props.roomId,
            message: "",
            sender: "",
            type: "CALL",
            socketId: this.props.sessionId,
          })
        );

        break;
      case "레이즈":
        this.setState({
          myBet:this.state.currentBetUnit
        })
        console.log("raise " + this.state.currentBetUnit);
        this.props.stomp.send(
          "/pub/game/message",
          {},
          JSON.stringify({
            roomId: this.props.roomId,
            message: this.state.currentBetUnit,
            sender: "",
            type: "RAISE",
            socketId: this.props.sessionId,
          })
        );

        break;
      case "올인":
        console.log("allin ");
        this.props.stomp.send(
          "/pub/game/message",
          {},
          JSON.stringify({
            roomId: this.props.roomId,
            message: "",
            sender: "",
            type: "ALLIN",
            socketId: this.props.sessionId,
          })
        );

        break;
      case "다이":
        console.log("die");
        this.props.stomp.send(
          "/pub/game/message",
          {},
          JSON.stringify({
            roomId: this.props.roomId,
            message: "",
            sender: "",
            type: "DIE",
            socketId: this.props.sessionId,
          })
        );
        //나가기 버튼 활성화

        break;
      default:
        break;
    }
  }
  // updateChat(chatList) {
  //     this.state.chatList = chatList
  //     console.log("채팅 update 완료")
  //     console.log(chatList)
  //     console.log(this.state.chatList)
  // }

  async switchCamera() {
    try {
      const devices = await this.OV.getDevices();
      var videoDevices = devices.filter((device) => device.kind === "videoinput");

      if (videoDevices && videoDevices.length > 1) {
        var newVideoDevice = videoDevices.filter(
          (device) => device.deviceId !== this.state.currentVideoDevice.deviceId
        );

        if (newVideoDevice.length > 0) {
          // Creating a new publisher with specific videoSource
          // In mobile devices the default and first camera is the front one
          var newPublisher = this.OV.initPublisher(undefined, {
            videoSource: newVideoDevice[0].deviceId,
            publishAudio: true,
            publishVideo: true,
            mirror: true,
          });

          //newPublisher.once("accessAllowed", () => {
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

  render() {
    const mySessionId = this.state.mySessionId;
    const myUserName = this.state.myUserName;
    const players = this.state.players;
    const state = this.state;
    const chatList = this.state.chatList;
    const isStart = this.state.isStart;
    return (
      <div className={styles.container}>
        {/* 입장 전 */}

        {/* 입장 후 */}

        <div className={styles.header}>
          <h1>
            <ArrowForwardIosRoundedIcon className={styles.icon} />
            게임방 이름
          </h1>
          <h2>기본 베팅 10 루비</h2>
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
                className={styles.myCam}
              >
                <UserVideoComponent
                  streamManager={this.state.publisher}
                  player={this.props.players[0]}
                  number={0}
                />
              </div>
            ) : null}

            {this.props.players[1] && this.state.subscribers[0] ? (
              <div key={0} className={this.test[0]}>
                <UserVideoComponent
                  streamManager={this.state.subscribers[0]}
                  player={this.props.players[1]}
                />
                {this.props.win[1] ? <img src={ruby_get} className={styles.rubyGet} /> : null}
              </div>
            ) : null}
            {this.props.players[2] && this.state.subscribers[1] ? (
              <div key={1} className={this.test[1]}>
                <UserVideoComponent
                  streamManager={this.state.subscribers[1]}
                  player={this.props.players[2]}
                />
                {this.props.win[2] ? <img src={ruby_get} className={styles.rubyGet} /> : null}
              </div>
            ) : null}
            {this.props.players[3] && this.state.subscribers[2] ? (
              <div key={2} className={this.test[2]}>
                <UserVideoComponent
                  streamManager={this.state.subscribers[2]}
                  player={this.props.players[3]}
                />
                {this.props.win[3] ? <img src={ruby_get} className={styles.rubyGet} /> : null}
              </div>
            ) : null}
            {this.props.players[4] && this.state.subscribers[3] ? (
              <div key={3} className={this.test[3]}>
                <UserVideoComponent
                  streamManager={this.state.subscribers[3]}
                  player={this.props.players[4]}
                />
                {this.props.win[4] ? <img src={ruby_get} className={styles.rubyGet} /> : null}
              </div>
            ) : null}
            {this.props.players[5] && this.state.subscribers[4] ? (
              <div key={4} className={this.test[4]}>
                <UserVideoComponent
                  streamManager={this.state.subscribers[4]}
                  player={this.props.players[5]}
                />
                {this.props.win[5] ? <img src={ruby_get} className={styles.rubyGet} /> : null}
              </div>
            ) : null}
          </div>
        ) : null}

        <div className={styles.center}>
          <div className={styles.qs}>누가 거짓말쟁이?</div>
          <div className={styles.cards}>
            <div className={`${styles.cards_back} ${styles.flip_back}`}>
              <img src={card_back} />
              <img src={card_back} />
            </div>
            <div className={`${styles.cards_front} ${styles.flip_front}`}>
              <img src={card_am_1} />
              <img src={card_aq_1} />
            </div>
          </div>
          {/* 베팅시*/}
          {/* <img src={ruby_bet} className={styles.rubyBet}/> */}
          {/* 내가 게임 이길시*/}
          {/* <img src={ruby_win} className={styles.rubyWin}/> */}
          <div className={styles.info}>
            <div className={styles.time}>{this.state.seconds}초</div>
            <div className={styles.ruby}>
              <img src={ruby} className={styles.rubyImg} />
              <p className={styles.rubyNum}>1,000,000</p>
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
        {isStart ? (
          <div className={styles.betting}>
            <button onClick={this.sendBet} disabled={this.state.buttonDisable[0]}>
              다이
            </button>
            <button onClick={this.sendBet} disabled={this.state.buttonDisable[1]}>
              콜
            </button>
            <button onClick={this.sendBet} disabled={this.state.buttonDisable[2]}>
              레이즈
            </button>
            <button onClick={this.sendBet} disabled={this.state.buttonDisable[3]}>
              올인
            </button>
          </div>
        ) : (
          <div className={styles.start}>
            <button onClick={this.gameStart} disabled={this.state.startDisabled}>
              게임시작
            </button>
          </div>
        )}
        {/* 베팅버튼 */}
        <div className={styles.betting}>
          <button>다이</button>
          <button>콜</button>
          <div className={styles.betList}>
            <p>레이즈</p>
            <input
              className={styles.betInput}
              type={"number"}
              step="10"
              placeholder="베팅 루비 입력"
            ></input>
            <button className={styles.betBtn}>확인</button>
          </div>
          <button>올인</button>
        </div>
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
