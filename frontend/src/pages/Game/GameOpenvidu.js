import axios from "axios";
import { OpenVidu } from "openvidu-browser";
import React from "react";
import UserVideoComponent from "../../components/Openvidu/UserVideo";
import Chat from "../../components/Openvidu/Chat";
import styles from "./GameOpenvidu.module.css";
import { useEffect, useState } from "react";
import ArrowForwardIosRoundedIcon from "@mui/icons-material/ArrowForwardIosRounded";
import card_am_1 from "../../images/cards/card_am_1.png";
import card_aq_1 from "../../images/cards/card_aq_1.png";

import card_back from "../../images/cards/card_back_logo.png";
import ruby_win from "../../images/ruby_win.gif";
import ReactDOM from "react-dom";
import Popover from "react-popover";
import HelpOutlineRoundedIcon from "@mui/icons-material/HelpOutlineRounded";

const OPENVIDU_SERVER_URL = "https://" + "i7a404.p.ssafy.io" + ":8443";
const OPENVIDU_SERVER_SECRET = "MY_SECRET";

export default function Gameroom(props) {
  const [mySessionId, setmySessionId] = useState(props.roomId);
  const [myUserName, setmyUserName] = useState("participant" + Math.floor(Math.random() * 100));
  const [session, setsession] = useState(undefined);
  const [mainStreamManager, setmainStreamManager] = useState(undefined);
  const [publisher, setpublisher] = useState(undefined);
  const [subscribers, setsubscribers] = useState([]);
  const [players, setplayers] = useState();
  const [setPlayers, setsetPlayers] = useState();
  const [chatList, setchatList] = useState();
  const [OV, setOV] = useState();
  const [isOpen, setIsOpen] = useState(false);
  const [seconds, setseconds] = useState(30);
  const [isStart, setisStart] = useState(false);

  let test = [styles.player1, styles.player2, styles.player3, styles.player4, styles.player5];

  useEffect(() => {
    window.addEventListener("beforeunload", onbeforeunload);
    joinSession();

    return () => {
      window.removeEventListener("beforeunload", onbeforeunload);
    };
  });

  function onbeforeunload(event) {
    leaveSession();
  }

  // function handleChangeSessionId(e) {
  //   setmySessionId(e.target.value);
  // }

  // function handleChangeUserName(e) {
  //   setmyUserName(e.target.value);
  // }

  function handleMainVideoStream(stream) {
    if (mainStreamManager !== stream) {
      setmainStreamManager(stream);
    }
  }

  function deleteSubscriber(streamManager) {
    let subscribers = subscribers;
    let index = subscribers.indexOf(streamManager, 0);
    if (index > -1) {
      setsubscribers(subscribers.splice(index, 1));
    }
  }
  function startClick() {
    console.log("겜시작");
    this.timerId = setInterval(() => {
      setseconds(seconds - 1);
    }, 1000);
  }

  function togglePopover() {
    setIsOpen(!isOpen);
  }

  function joinSession() {
    // --- 1) Get an OpenVidu object ---
    console.log("joinsession " + props.roomId);
    setOV(new OpenVidu());

    // --- 2) Init a session ---
    setsession(OV.initSession());
  }

  useEffect(() => {
    var mySession = session;
    console.log(JSON.stringify(props.roomInfo));
    // --- 3) Specify the actions when events take place in the session ---

    // On every new Stream received...
    mySession.on("streamCreated", (event) => {
      // Subscribe to the Stream to receive it. Second parameter is undefined
      // so OpenVidu doesn't create an HTML video by its own
      var subscriber = mySession.subscribe(event.stream, undefined);
      var tempsubscriber = subscribers;
      tempsubscriber.push(subscriber);

      // const message = event

      // Update the state with the new subscribers
      setsubscribers(tempsubscriber);
    });

    mySession.on("signal:my-chat", (event) => {
      const message = event.data.split(":");
      const chatmsg = { name: message[0], msg: message[1] };
      // console.log("event.date print:" + event.data);
      // console.log("event print:" + event);
      // console.log(event);
      setchatList(chatList.concat(chatmsg));
      // console.log("chatlist print: " + chatList);
      // console.log(chatList);
    });

    // On every Stream destroyed...
    mySession.on("streamDestroyed", (event) => {
      // Remove the stream from 'subscribers' array
      deleteSubscriber(event.stream.streamManager);
    });

    // On every asynchronous exception...
    mySession.on("exception", (exception) => {
      console.warn(exception);
    });

    // --- 4) Connect to the session with a valid user token ---

    // 'getToken' method is simulating what your server-side should do.
    // 'token' parameter should be retrieved and returned by your own backend
    getToken().then((token) => {
      // First param is the token got from OpenVidu Server. Second param can be retrieved by every user on event
      // 'streamCreated' (property Stream.connection.data), and will be appended to DOM as the user's nickname
      mySession
        .connect(
          token,
          { clientData: props.roomInfo.playerInfo[0].nickname }
          // { clientData: myUserName },
        )
        .then(async () => {
          var devices = await OV.getDevices();
          var videoDevices = devices.filter((device) => device.kind === "videoinput");
          console.log("mysession connecting...");
          // --- 5) Get your own camera stream ---

          // Init a publisher passing undefined as targetElement (we don't want OpenVidu to insert a video
          // element: we will manage it on our own) and with the desired properties
          let publisher = OV.initPublisher(undefined, {
            audioSource: undefined, // The source of audio. If undefined default microphone
            videoSource: videoDevices[0].deviceId, // The source of video. If undefined default webcam
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
            currentVideoDevice: videoDevices[0],
            mainStreamManager: publisher,
            publisher: publisher,
          });
        })
        .catch((error) => {
          console.log("There was an error connecting to the session:", error.code, error.message);
        });
    });
  }, [session]);

  function leaveSession() {
    // --- 7) Leave the session by calling 'disconnect' method over the Session object ---

    const mySession = session;

    if (mySession) {
      mySession.disconnect();
    }

    // Empty all properties...
    OV = null;
    setsession(undefined);
    setsubscribers([]);
    // setmySessionId("SessionA");
    // setmyUserName("participant" + Math.floor(Math.random() * 100));

    setmainStreamManager(undefined);
    setpublisher(undefined);
  }

  // 채팅 메세지 부분
  function sendMessage(type, data) {
    const mySession = this.state.session;

    mySession.signal({
      data: data,
      to: [],
      type: type,
    });
  }

  function sendChat(msg) {
    var chatMsg = myUserName + " : " + msg;
    sendMessage("my-chat", chatMsg);
  }
  // updateChat(chatList) {
  //     chatList = chatList
  //     console.log("채팅 update 완료")
  //     console.log(chatList)
  //     console.log(chatList)
  // }

  async function switchCamera() {
    try {
      const devices = await OV.getDevices();
      var videoDevices = devices.filter((device) => device.kind === "videoinput");

      if (videoDevices && videoDevices.length > 1) {
        var newVideoDevice = videoDevices.filter(
          (device) => device.deviceId !== this.state.currentVideoDevice.deviceId
        );

        if (newVideoDevice.length > 0) {
          // Creating a new publisher with specific videoSource
          // In mobile devices the default and first camera is the front one
          var newPublisher = OV.initPublisher(undefined, {
            videoSource: newVideoDevice[0].deviceId,
            publishAudio: true,
            publishVideo: true,
            mirror: true,
          });

          //newPublisher.once("accessAllowed", () => {
          await session.unpublish(mainStreamManager);

          await session.publish(newPublisher);
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

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>
          <ArrowForwardIosRoundedIcon className={styles.icon} />
          게임방 이름
        </h1>
        <h2>기본 베팅 10 루비</h2>
        <div className={styles.buttonList}>
          <button className={styles.button}>나가기</button>
        </div>
      </div>
      {session !== undefined ? (
        <div className={styles.grid}>
          {publisher !== undefined ? (
            <div onClick={() => handleMainVideoStream(publisher)} className={styles.myCam}>
              <UserVideoComponent streamManager={publisher} />
            </div>
          ) : null}
          {subscribers.map((sub, i) => (
            <div key={i} onClick={() => handleMainVideoStream(sub)} className={this.test[i]}>
              <UserVideoComponent streamManager={sub} />
            </div>
          ))}
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
            {/* 게임 이길시 gif*/}
            {/* <img src={ruby_win} className={styles.win}/> */}
            <div className={styles.info}>
              <div className={styles.time}>{seconds}초</div>
              <div className={styles.money}>돈돈돈돈</div>
              <div className={styles.help}>
                <Popover
                  isOpen={isOpen}
                  body={
                    <div className={styles.popover}>
                      더블 &#60; 스트레이트 &#60; 트리플
                      <br />
                      자수정 &#60; 아쿠아마린 &#60; 다이아몬드 &#60; 에메랄드
                    </div>
                  }
                  onOuterAction={togglePopover}
                >
                  <HelpOutlineRoundedIcon className={styles.popoverBtn} onClick={togglePopover} />
                </Popover>
              </div>
            </div>
          </div>
          <div className={styles.chat}>
            <Chat sendChat={sendChat} chatList={chatList} />
          </div>
          {/* 게임시작버튼 */}
          {/* <div className={styles.start}>
                            <button onClick={startClick}>게임시작</button>
                        </div> */}
          {/* 베팅버튼 */}
          <div className={styles.betting}>
            <button>다이</button>
            <button>콜</button>
            <button>
              레이즈
              <div className={styles.betList}>
                <input
                  className={styles.betInput}
                  type={"number"}
                  step="10"
                  placeholder="베팅 루비"
                ></input>
                <button className={styles.betBtn}>베팅</button>
              </div>
            </button>
            <button>올인</button>
          </div>
        </div>
      ) : null}
    </div>
  );

  // updateChat(chatList) {
  //     this.state.chatList = chatList
  //     console.log("채팅 update 완료")
  //     console.log(chatList)
  //     console.log(this.state.chatList)
  // }

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

  function getToken() {
    return createSession("room" + props.roomId).then((sessionId) => createToken(sessionId));
  }

  function createSession(sessionId) {
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

  function createToken(sessionId) {
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
