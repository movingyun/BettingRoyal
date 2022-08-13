import axios from "axios";
import { OpenVidu } from "openvidu-browser";
import React from "react";
import UserVideoComponent from "../../components/Openvidu/UserVideo";
import Chat from "../../components/Openvidu/Chat";
import styles from "./GameOpenvidu.module.css";
import { useEffect, useState, useRef } from "react";
import ArrowForwardIosRoundedIcon from "@mui/icons-material/ArrowForwardIosRounded";
import card_am_1 from "../../images/cards/card_am_1.png";
import card_aq_1 from "../../images/cards/card_aq_1.png";
import sockjs from "sockjs-client";
import stompjs from "stompjs";
import card_back from "../../images/cards/card_back_logo.png";
import ruby_win from "../../images/ruby_win.gif";
import ReactDOM from "react-dom";
import Popover from "react-popover";
import HelpOutlineRoundedIcon from "@mui/icons-material/HelpOutlineRounded";
import { OpenViduLoggerConfiguration } from "openvidu-browser/lib/OpenViduInternal/Logger/OpenViduLoggerConfiguration";

import { useNavigate, useLocation } from "react-router-dom";
const OPENVIDU_SERVER_URL = "https://" + "i7a404.p.ssafy.io" + ":8443";
const OPENVIDU_SERVER_SECRET = "MY_SECRET";

export default function Gameroom(props) {
  // const [mySessionId, setmySessionId] = useState(roomId);
  const [myUserName, setmyUserName] = useState("participant" + Math.floor(Math.random() * 100));
  const [session, setsession] = useState();
  const [mainStreamManager, setmainStreamManager] = useState(undefined);
  const [publisher, setpublisher] = useState(undefined);
  const [subscribers, setsubscribers] = useState([]);

  const [chatList, setchatList] = useState([]);
  const [OV, setOV] = useState(undefined);
  const [isOpen, setIsOpen] = useState(false);
  const [seconds, setseconds] = useState(30);
  const [isStart, setIsStart] = useState(false);

  const [playerOpenvidu, setPlayerOpenvidu] = useState([]);
  const [players, setPlayers] = useState([]);
  const [turn, setTurn] = useState([]);
  const [currentBetUnit, setCurrentBetUnit] = useState(0);
  const [currentMaxBet, setCurrentMaxBet] = useState(0);
  const [myBet, setMyBet] = useState(0);
  const [myTotalBet, setMyTotalBet] = useState(0);
  const [mainMessage, setmainMessage] = useState("");
  const [buttonDisable, setbuttonDisable] = useState([true, true, true, true]);
  const [startDisabled, setstartDisabled] = useState(false);
  const [gameTotalBet, setGameTotalBet] = useState(0);
  const [groundCard1, setGroundCard1] = useState(0);
  const [groundCard2, setGroundCard2] = useState(0);
  const [roomInfo, setroomInfo] = useState();
  const [isEnter, setisEnter] = useState(false);
  const [sessionId, setsessionId] = useState(false);
  const [win, setwin] = useState([false, false, false, false, false, false]);
  const [currentVideoDevice, setcurrentVideoDevice] = useState();

  const [sec, setSec] = useState(0);
  const time = useRef(30); // 30초타이머
  const timerId = useRef(null);

  let navigate = useNavigate();
  let location = useLocation();
  let roomId = location.state.roomId; //방 컴포넌트에 roomid 포함
  var sock = new sockjs("http://localhost:8080/stomp-game");
  let stomp = stompjs.over(sock);

  // let OV;
  let test = [styles.player1, styles.player2, styles.player3, styles.player4, styles.player5];
  // let OV= new OpenVidu();
  // let session=OV.initSession();
  // useEffect(() => {

  //   return () => {
  //     window.removeEventListener("beforeunload", onbeforeunload);
  //   };
  // }, []);
  useEffect(() => {
    if (subscribers.length > 0) {
      console.log(subscribers);
    }
  }, [subscribers]);

  useEffect(() => {
    window.addEventListener("beforeunload", onbeforeunload);
    // setOV(new OpenVidu());
    // joinSession();
    console.log(roomId + "번 방 참가");
    stomp.connect({}, () => {
      stomp.send(
        "/pub/game/message",
        {},
        JSON.stringify({
          roomId: roomId,
          senderNickName: window.localStorage.getItem("accessToken"),
          type: "ENTER",
        })
      );

      //메시지를 받으면
      stomp.subscribe("/sub/game/room" + roomId, function (message) {
        var content = JSON.parse(message.body);

        //사람이 나갔을 때
        if (content.type == "EXIT") {
          //{player}
          let arr = players;
          for (let i = 0; i < players; i++) {
            if (players[i] != content.playerInfo[i]) {
              arr.splice(i, 1);
              console.log(players[i].sessionId + " left");
            }
          }
          setPlayers(arr);
        }

        //게임이 시작됐을 때
        if (content.type == "START") {
          setmainMessage("게임 시작!");

          setIsStart(true);
          //카메라 체크
        }

        //그라운드 카드 받을 때
        if (content.type == "GROUNDCARD") {
          //message : {"공통카드 : card1, card2"}
          console.log("그라운드카드 받아라~" + content.message);

          setGroundCard1(content.groundCardNum1);
          setGroundCard2(content.groundCardNum2);
        }

        //수시로 서버와 동기화
        if (content.type == "SYNC") {
          //{betUnit, players[], }
          setPlayers(content.playersInfo);
          setCurrentBetUnit(content.betUnit);
        }
      });

      stomp.subscribe("/user/sub/game/room" + roomId, function (message) {
        var content = JSON.parse(message.body);

        //사람이 들어왔을 때
        if (content.type == "ENTER") {
          console.log("사람들어왔다" + JSON.stringify(content.playerInfo));
          setTurn(content.turnIdx);
          if (content.playerInfo) {
            setPlayers(content.playerInfo);
            setsessionId(content.playerInfo[0].sessionId);
          }
          setroomInfo(content);
          setisEnter(true);
          if (content.turnIdx == 0) {
            setstartDisabled(false);
          }
        }

        //개인 카드 받기
        if (content.type == "GETMYCARD") {
          setPlayers(content.playerInfo);
          if (content.turnIdx == 0) {
            setbuttonDisable([false, true, false, false]);
          }
          setCurrentBetUnit(content.battingUnit);
          setCurrentMaxBet(content.gameTotalBet);
          setmainMessage("현재 총 베팅 금액 : " + content.gameTotalBet);
        }

        //턴
        if (content.type == "NEXTTURN") {
          setTurn(content.turnIdx);
          setCurrentMaxBet(content.gameTotalBet);
          setPlayers(content.playerInfo);
          setmainMessage("현재 총 베팅 금액 : " + content.gameTotalBet);
          //내턴일때
          if (content.turnIdx == 0) {
            setbuttonDisable([false, false, false, false]);
            // if (currentMaxBet > myTotalBet) {
            //   //콜 버튼 비활성화
            //   setbuttonDisable([false, true, false, false]);
            // }
          }
          //다른사람 턴일때
          else {
            setbuttonDisable([true, true, true, true]);
          }
        }

        //게임 끝
        if (content.type == "GAMEEND") {
          setbuttonDisable([true, true, true, true]);
          setPlayers(content.playerInfo);
          setTurn(content.turnIdx);
          //이긴사람 표시
          setmainMessage(content.playerInfo[content.winnerIdx].nickname + " 승리!!");

          let tempwin = [false, false, false, false, false, false];
          tempwin[content.winnerIdx] = true;
          setwin(tempwin);

          //2.5초간 효과재생 후 게임시작 활성화
          setTimeout(() => {
            setwin([false, false, false, false, false, false]);
            setIsStart(false);
            console.log(win);
          }, 2500);
        }
      });
    });
    return () => {
      window.removeEventListener("beforeunload", onbeforeunload);
      //컴포넌트 unmount 시
      stomp.send(
        "/pub/game/message",
        {},
        JSON.stringify({
          roomId: roomId,
          message: "",
          sender: "",
          type: "EXIT",
          socketId: sessionId,
        })
      );
    };
  }, []);

  useEffect(() => {
    if (time.current <= 0) {
      console.log("끝");
      clearInterval(timerId.current);
    }
  }, [sec]);

  function gameStart(e) {
    if (turn == 0) {
      console.log("겜시작");
      setIsStart(true);

      stomp.send(
        "/pub/game/message",
        {},
        JSON.stringify({ roomId: roomId, message: "", sender: "", type: "START" })
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

  useEffect(()=>{
    joinSession();
  },[roomInfo])

  function settimer(amount) {}

  //콜 다이 레이즈 올인 클릭
  function sendBet(action) {
    //call die raise allin
    console.log(action.target.textContent);
    switch (action.target.textContent) {
      case "콜":
        console.log("z");
        stomp.send(
          "/pub/game/message",
          {},
          JSON.stringify({
            roomId: roomId,
            message: "",
            sender: "",
            type: "CALL",
            socketId: sessionId,
          })
        );

        break;
      case "레이즈":
        setMyBet(currentBetUnit);
        console.log("raise " + currentBetUnit);
        stomp.send(
          "/pub/game/message",
          {},
          JSON.stringify({
            roomId: roomId,
            message: currentBetUnit,
            sender: "",
            type: "RAISE",
            socketId: sessionId,
          })
        );

        break;
      case "올인":
        console.log("allin ");
        stomp.send(
          "/pub/game/message",
          {},
          JSON.stringify({
            roomId: roomId,
            message: "",
            sender: "",
            type: "ALLIN",
            socketId: sessionId,
          })
        );

        break;
      case "다이":
        console.log("die");
        stomp.send(
          "/pub/game/message",
          {},
          JSON.stringify({
            roomId: roomId,
            message: "",
            sender: "",
            type: "DIE",
            socketId: sessionId,
          })
        );
        //나가기 버튼 활성화

        break;
      default:
        break;
    }
  }

  //나가기
  function leaveGame() {
    console.log("나가기 누름");
    if (window.confirm("나가시겠습니까?") == true) {
      stomp.send(
        "/pub/game/message",
        {},
        JSON.stringify({
          roomId: roomId,
          message: "",
          sender: "",
          type: "EXIT",
          socketId: sessionId,
        })
      );
      navigate("../lobby");
    } else {
    }
  }

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

  async function joinSession() {
    // // --- 1) Get an OpenVidu object ---
    // console.log("joinsession " + props.roomId);
    setOV(new OpenVidu());
    // OV = new OpenVidu();

    // setsession(OV.initSession())
    // // // --- 2) Init a session ---
    // setsession(session=>session=OV.initSession());
  }
  useEffect(() => {
    if (OV) {
      console.log(typeof OV);
      setsession(OV.initSession());
    }
  }, [OV]);

  useEffect(() => {
    if (session) {
      console.log(typeof session);
      var mySession = session;
      console.log(JSON.stringify(roomInfo));
      // --- 3) Specify the actions when events take place in the session ---

      // On every new Stream received...
      mySession.on("streamCreated", (event) => {
        console.log("stream created");
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
        console.log("signal ");
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
        console.log("stream destroyed");
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
            { clientData: roomInfo.playerInfo[0].nickname }
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
            setpublisher(publisher);
            setmainStreamManager(publisher);
            // --- 6) Publish your stream ---

            mySession.publish(publisher);

            // Set the main video in the page to display our webcam and store our Publisher

            setcurrentVideoDevice(videoDevices[0]);
            // this.setState({
            //   currentVideoDevice: videoDevices[0],
            //   // mainStreamManager: publisher,
            //   // publisher: publisher,
            // });
          })
          .catch((error) => {
            console.log("There was an error connecting to the session:", error.code, error.message);
          });
      });
    }
  }, [session]);

  function leaveSession() {
    // --- 7) Leave the session by calling 'disconnect' method over the Session object ---

    const mySession = session;

    if (mySession) {
      mySession.disconnect();
    }

    // Empty all properties...
    // setOV(null)
    OV = null;
    // setsession(undefined);
    session = undefined;
    setsubscribers([]);
    // setmySessionId("SessionA");
    // setmyUserName("participant" + Math.floor(Math.random() * 100));

    setmainStreamManager(undefined);
    setpublisher(undefined);
  }

  // 채팅 메세지 부분
  function sendMessage(type, data) {
    const mySession = session;

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
          // (device) => device.deviceId !== this.state.currentVideoDevice.deviceId
          (device) => device.deviceId !== currentVideoDevice.deviceId
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
          setmainStreamManager(newPublisher);
          setpublisher(newPublisher);
          setcurrentVideoDevice(newVideoDevice);
          // this.setState({
          //   currentVideoDevice: newVideoDevice,
          //   // mainStreamManager: newPublisher,
          //   // publisher: newPublisher,
          // });
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
        <button className={styles.button} onClick={leaveGame}>
            나가기
          </button>
        </div>
      </div>
      <div className={styles.center}>
        <div className={styles.qs}>{mainMessage}</div>
        <div className={styles.cards}>
          {/* 카드뒷면 */}
          <div
            id="card"
            className={`${styles.cards_back} ${isStart ? styles.flip_back : styles.none}`}
          >
            <img src={card_back} />
            <img src={card_back} />
          </div>
          {/* 카드앞면오픈 */}
          <div className={`${styles.cards_front} ${isStart ? styles.flip_front : styles.none}`}>
            <img src={groundCard1} />
            <img src={groundCard2} />
          </div>
        </div>
        <div className={styles.info}>
          <div className={styles.time}>
            {sec}초<div className={styles.timer_front}></div>
            <div className={styles.timer_back}></div>
          </div>
          <div className={styles.money}>돈돈돈돈</div>
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
            <div key={i} onClick={() => handleMainVideoStream(sub)} className={test[i]}>
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
          {isStart ? (
            <div className={styles.betting}>
              <button onClick={sendBet} disabled={buttonDisable[0]}>
                다이
              </button>
              <button onClick={sendBet} disabled={buttonDisable[1]}>
                콜
              </button>
              <button onClick={sendBet} disabled={buttonDisable[2]}>
                레이즈
              </button>
              <button onClick={sendBet} disabled={buttonDisable[3]}>
                올인
              </button>
            </div>
          ) : (
            <div className={styles.start}>
              <button onClick={gameStart} disabled={startDisabled}>
                게임시작
              </button>
            </div>
          )}
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
    return createSession("room" + roomId).then((sessionId) => createToken(sessionId));
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
