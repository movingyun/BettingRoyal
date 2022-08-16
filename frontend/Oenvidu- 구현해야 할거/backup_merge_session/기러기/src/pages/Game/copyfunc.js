import styles from "../components/roomin/Room.module.css";
import Musicbar from "../components/roomin/Musicbar";
import Screen from "../components/roomin/Screen";
import RoomChat from "../components/roomin/R_Chat";
import Button from "../components/roomin/Button";
import MirrorBall from "../components/roomin/MirrorBall";
import LightRope from "../components/roomin/LightRope";
import ChangeMode from "../components/roomin/ChangeMode";
import Contents from "../components/roomin/Contents";
import { useState } from "react";
import Crazylights from "../components/roomin/Crazylights";
import { Link, useParams } from "react-router-dom";
import Controller from "../components/remote/Controller";
import { connect } from "react-redux";
import { useEffect } from "react";
import Firework from "../components/remote/Firework";
import AWS from "aws-sdk";
import UserVideoComponent from "../components/openvidu/UserVideoComponent";
import { OpenVidu } from "openvidu-browser";
import axios from "axios";
import Dream from "../components/roomin/Dream";
import GoodDay from "../components/roomin/GoodDay";
import ScoreBoard from "../components/roomin/ScoreBoard";
import Draggable from "react-draggable";
import Clap from "../components/remote/audio/Clap.wav";
import Tambourine from "../components/remote/audio/Tambourine.mp3";
import Swal from "sweetalert2";

const OPENVIDU_SERVER_URL = "https://i6a306.p.ssafy.io";
const OPENVIDU_SERVER_SECRET = "qwer1234";
const URL_PREFIX = "https://www.youtube.com/watch?v=";
const RANDOM_PITCH = [
  "0.76",
  "0.77",
  "0.78",
  "0.79",
  "0.80",
  "1.4",
  "1.5",
  "1.7",
  "1.8",
  "2.0",
];
////////////////////////////////////////////////////////////Room

function Room({ state }) {
  const [openChangeMode, setOpenChangeMode] = useState(false);
  const [openContents, setOpenContents] = useState(false);
  const [openFirework, setOpenFirework] = useState(false);
  const [nowPlaymusic, setnowPlaymusic] = useState("");
  const [chatArr, setChatArr] = useState([]);

  const name = state[0].nickname; //{ Nickname }.Nickname; //redux에 저장된 user nickname
  const { mode, roomnum } = useParams();
  const room = { roomnum }.roomnum; //redux에 저장된 room_seq
  const firstmode = { mode }.mode;

  const [transScreen, settransScreen] = useState(styles.ScreenBasic);
  const [transCamBox, settransCamBox] = useState(styles.BasicCamBox);
  const [transChatBox, settransChatBox] = useState(styles.BasicChatBox);
  const [transChat, settransChat] = useState(styles.BasicChat);
  const [nowMode, setnowMode] = useState("Basicmode");
  const [startDream, setstartDream] = useState(false);
  const [startGoodDay, setstartGoodDay] = useState(false);
  const [startScoreBoard, setstartScoreBoard] = useState(false);

  // const [ myUserName, setmyUserName] = useState({ Nickname }.Nickname);//Nickname으로 쓰임
  const [session, setsession] = useState(undefined);
  const [publisher, setpublisher] = useState(undefined);
  const [subscribers, setsubscribers] = useState([]);
  const [OV, setOV] = useState(undefined);
  const [gsfilter, setgsfilter] = useState(false);
  const [musicbartitle, setmusicbartitle] = useState("");

  const [audio, setAudio] = useState(true);
  const [video, setVideo] = useState(true);

  const [nowplaying, setNowplaying] = useState(false);
  const getNowplaying = (bool) => {
    setNowplaying(bool);
  };

  function transformBasic() {
    settransScreen(styles.ScreenBasic);
    settransCamBox(styles.BasicCamBox);
    settransChatBox(styles.BasicChatBox);
    settransChat(styles.BasicChat);
    setnowMode("Basicmode");
  }

  function transformSolo() {
    settransScreen(styles.ScreenSolo);
    settransCamBox(styles.SoloCamBox);
    settransChatBox(styles.SoloChatBox);
    settransChat(styles.SoloChat);
    setnowMode("Solomode");
  }

  function transformDuet() {
    settransScreen(styles.ScreenDuet);
    settransCamBox(styles.DuetCamBox);
    settransChatBox(styles.DuetChatBox);
    settransChat(styles.FreeChat);
    setnowMode("Duetmode");
  }

  function transformFree() {
    settransScreen(styles.ScreenFree);
    settransCamBox(styles.FreeCamBox);
    settransChatBox(styles.FreeChatBox);
    settransChat(styles.FreeChat);
    setnowMode("Freemode");
  }

  useEffect(() => {
    if (firstmode === "Basic") {
      transformBasic();
    } else if (firstmode === "Free") {
      transformFree();
    } else if (firstmode === "Solo") {
      transformSolo();
    } else if (firstmode === "Duet") {
      transformDuet();
    }
  }, []);

  useEffect(() => {
    // --- 3) Specify the actions when events take place in the session ---
    // my-chat
    if (session !== undefined && OV !== undefined) {
      var mySession = session;
      mySession.on("signal:my-chat", (event) => {
        const message = event.data.split(":");
        const chatmsg = { name: message[0], msg: message[1] };
        setChatArr((chatArr) => chatArr.concat(chatmsg));
      });
      mySession.on("signal:YTUrl", (event) => {
        var data = JSON.parse(event.data);
        var url;
        if (event.data.url === "") {
          url = data.url;
        } else {
          url = URL_PREFIX + data.url;
        }
        setmusicbartitle(data.title);
        setnowPlaymusic(url); //현재 재생할 url
      });

      mySession.on("signal:effect", (event) => {
        if (event.data === "clap") {
          //clap 치기
          const audio = new Audio(Clap);
          audio.volume = 0.03;
          audio.play();
        } else if (event.data === "tambourine") {
          //tambourine 치기
          const audio2 = new Audio(Tambourine);
          audio2.volume = 0.2;
          audio2.play();
        } else if (event.data === "firework") {
          //firework 쏘기
          setOpenFirework(true);
          setTimeout(function () {
            setOpenFirework(false);
          }, 6000);
        }
      });

      mySession.on("signal:basicSinger", (event) => {
        document.getElementById(event.data).className = styles.basicSingercam;
      });

      mySession.on("signal:basicSingerout", (event) => {
        document.getElementById(event.data).className = "undefined";
      });

      mySession.on("signal:soloSinger", (event) => {
        document.getElementById(event.data).className = styles.soloSingercam;
      });

      mySession.on("signal:soloSingerout", (event) => {
        document.getElementById(event.data).className = "undefined";
      });

      mySession.on("signal:duetSinger", (event) => {
        document.getElementById(event.data).className = styles.duetSingercam;
      });

      mySession.on("signal:duetSingerout", (event) => {
        document.getElementById(event.data).className = "undefined";
      });

      mySession.on("signal:duetSinger2", (event) => {
        document.getElementById(event.data).className = styles.duetSingercam2;
      });

      mySession.on("signal:duetSinger2out", (event) => {
        document.getElementById(event.data).className = "undefined";
      });

      mySession.on("signal:changeMode", (event) => {
        if (event.data === "Basic") {
          transformBasic();
        } else if (event.data === "Free") {
          transformFree();
        } else if (event.data === "Solo") {
          transformSolo();
        } else if (event.data === "Duet") {
          transformDuet();
        }
      });

      mySession.on("signal:Contents", (event) => {
        if (event.data === "Dream") {
          setstartDream(true);
        } else if (event.data === "GoodDay") {
          setstartGoodDay(true);
        }
      });

      // On every new Stream received...
      mySession.on("streamCreated", (event) => {
        // Subscribe to the Stream to receive it. Second parameter is undefined
        // so OpenVidu doesn't create an HTML video by its own
        let Subscriber = mySession.subscribe(event.stream, undefined);
        let subs = subscribers;
        subs.push(Subscriber);
        setsubscribers(subs);
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
          .connect(token, { clientData: name })
          .then(() => {
            let publisher = OV.initPublisher(undefined, {
              audioSource: undefined, // The source of audio. If undefined default microphone
              videoSource: undefined, // The source of video. If undefined default webcam
              publishAudio: true, // Whether you want to start publishing with your audio unmuted or not
              publishVideo: true, // Whether you want to start publishing with your video enabled or not
              resolution: "640x480", // The resolution of your video
              frameRate: 30, // The frame rate of your video
              insertMode: "APPEND", // How the video is inserted in the target element 'video-container'
              mirror: true, // Whether to mirror your local video or not
            });

            // --- 6) Publish your stream ---

            mySession.publish(publisher);

            // Set the main video in the page to display our webcam and store our Publisher
            setpublisher(publisher);
            // this.setState({
            //     // mainStreamManager: publisher,
            //     publisher: publisher,
            // });
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
  }, [session]);

  useEffect(() => {
    register();
  }, []);
``
  window.onbeforeunload = function () {
    onbeforeunload();
  };

  function onbeforeunload() {
    leaveRoom();
  }

  const deleteSubscriber = (streamManager) => {
    let subs = subscribers;
    let idx = subs.indexOf(streamManager, 0);
    if (idx > -1) {
      subs.splice(idx, 1);
      setsubscribers([...subs]);
    }
  };

  function leaveRoom() {
    // --- 7) Leave the session by calling 'disconnect' method over the Session object ---

    const mySession = session;

    if (mySession) {
      mySession.disconnect();
    }

    // Empty all properties...
    setOV(undefined);
    setsession(undefined);
    setsubscribers([]);
    setpublisher(undefined);

    axios.post(
      "https://i6a306.p.ssafy.io:8080/api/v1/room/out",
      {
        room_seq: room,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: state[0].token,
        },
      }
    );
  }
  function sendMessage(type, data) {
    const mySession = session;
    mySession.signal({
      data: data, // Any string (optional)
      to: [], // Array of Connection objects (optional. Broadcast to everyone if empty)
      type: type, // The type of message (optional)
    });
  }

  function register() {
    let OV = new OpenVidu();
    setOV(OV);
    setsession(OV.initSession());
  }

  function sendChat(msg) {
    var chatMsg = state[0].nickname + ":" + msg;
    sendMessage("my-chat", chatMsg);
  }

  function sendYTUrl() {
    //첫곡 불러와서 전송, 해당 곡은 DB에서 삭제 됨
    axios
      .get(`https://i6a306.p.ssafy.io:8080/api/v1/reservation/first/${room}`)
      .then((res) => {
        //title어디다 저장해두지 뮤직바 어디지
        var data = {
          url: res.data.song_no,
          title: res.data.song_title,
        };
        sendMessage("YTUrl", JSON.stringify(data)); //전송
      });
  }

  function sendClap() {
    sendMessage("effect", "clap");
  }

  function sendTambourine() {
    sendMessage("effect", "tambourine");
  }

  function sendFire() {
    sendMessage("effect", "firework");
  }

  function audioMute() {
    const me = publisher;
    if (me.stream.audioActive) {
      me.publishAudio(false);
      setAudio(false);
      console.log("마이크 끄기");
    } else {
      me.publishAudio(true);
      setAudio(true);
      console.log("마이크 켜기");
    }
  }

  function videoMute() {
    const me = publisher;
    if (me.stream.videoActive) {
      me.publishVideo(false);
      setVideo(false);
      console.log("비디오 끄기");
    } else {
      me.publishVideo(true);
      setVideo(true);
      console.log("비디오 켜기");
    }
  }

  function voiceFilterEcho() {
    const me = publisher;
    if (!gsfilter) {
      setgsfilter(true);
      me.stream.applyFilter("GStreamerFilter", {
        command: "audioecho delay=50000000 intensity=0.7 feedback=0.5",
      });
      new Swal({
        title: "에코 추가 완료!",
        timer: 500,
        showConfirmButton: false,
      });
    } else {
      setgsfilter(false);
      me.stream.removeFilter();
      new Swal({
        title: "에코 제거 완료!",
        timer: 500,
        showConfirmButton: false,
      });
    }
  }

  function voiceFilterMegaPhone() {
    const me = publisher;
    if (!gsfilter) {
      setgsfilter(true);
      me.stream.applyFilter("GStreamerFilter", {
        command: "audioamplify amplification=1.7",
      });
      new Swal({
        title: "확성기 설정 완료!",
        timer: 500,
        showConfirmButton: false,
      });
    } else {
      setgsfilter(false);
      me.stream.removeFilter();
      new Swal({
        title: "확성기 해제 완료!",
        timer: 500,
        showConfirmButton: false,
      });
    }
  }

  function voiceFilterModulation() {
    const me = publisher;
    if (!gsfilter) {
      setgsfilter(true);
      let pitch = RANDOM_PITCH[Math.floor(Math.random() * RANDOM_PITCH)];
      me.stream.applyFilter("GStreamerFilter", { command: `pitch pitch=1.7` });
      new Swal({
        title: "음성변조 설정 완료!",
        timer: 500,
        showConfirmButton: false,
      });
    } else {
      setgsfilter(false);
      me.stream.removeFilter();
      new Swal({
        title: "음성변조 해제 완료!",
        timer: 500,
        showConfirmButton: false,
      });
    }
  }

  function getToken() {
    return createSession(room).then((sessionId) => createToken(sessionId));
  }

  function createSession(sessionId) {
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
          resolve(response.data.id);
        })
        .catch((response) => {
          var error = Object.assign({}, response);
          if (error?.response?.status === 409) {
            resolve(sessionId);
          } else {
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

  function createToken(sessionId) {
    return new Promise((resolve, reject) => {
      axios
        .post(
          OPENVIDU_SERVER_URL +
            "/openvidu/api/sessions/" +
            sessionId +
            "/connection",
          JSON.stringify({
            kurentoOptions: {
              allowedFilters: ["GStreamerFilter", "FaceOverlayFilter"],
            },
          }),
          {
            headers: {
              Authorization:
                "Basic " + btoa("OPENVIDUAPP:" + OPENVIDU_SERVER_SECRET),
              "Content-Type": "application/json",
            },
          }
        )
        .then((response) => {
          resolve(response.data.token);
        })
        .catch((error) => reject(error));
    });
  }

  function basicsinger() {
    if (document.getElementById(name).className !== styles.basicSingercam) {
      sendMessage("basicSinger", name);
    } else {
      sendMessage("basicSingerout", name);
    }
  }

  function solosinger() {
    if (document.getElementById(name).className !== styles.soloSingercam) {
      sendMessage("soloSinger", name);
    } else {
      sendMessage("soloSingerout", name);
    }
  }
  function duetsinger() {
    if (document.getElementById(name).className !== styles.duetSingercam) {
      sendMessage("duetSinger", name);
    } else {
      sendMessage("duetSingerout", name);
    }
  }

  function duetsinger2() {
    if (document.getElementById(name).className !== styles.duetSingercam2) {
      sendMessage("duetSinger2", name);
    } else {
      sendMessage("duetSinger2out", name);
    }
  }
  ///////////////////////////////////////Free모드 캠 움직임
  const [Opacity, setOpacity] = useState(false);
  const handleStart = () => {
    setOpacity(true);
  };
  const handleEnd = () => {
    setOpacity(false);
  };

  function sendChangeModeB() {
    sendMessage("changeMode", "Basic");
  }

  function sendChangeModeF() {
    sendMessage("changeMode", "Free");
  }
  function sendChangeModeS() {
    sendMessage("changeMode", "Solo");
  }
  function sendChangeModeD() {
    sendMessage("changeMode", "Duet");
  }

  function sendstartDream() {
    sendMessage("Contents", "Dream");
  }

  function sendstartGoodDay() {
    sendMessage("Contents", "GoodDay");
  }

  //버킷, region 값 생성
  const S3_BUCKET = "YOUR_BUCKET_NAME_HERE"; //BUCKET 이름 자리
  const REGION = "YOUR_DESIRED_REGION_HERE"; //Region 값 자리

  AWS.config.update({
    accessKeyId: "", //access키 id 넣기
    secretAccessKey: "", //secretaccess 키 넣기
  });

  const myBucket = new AWS.S3({
    params: { Bucket: S3_BUCKET }, //위에서 지정한 BUCKET을 받아와서 생성
    region: REGION,
  });

  // const UploadFileToS3WithNativeSdk = () => {
  const [progress, setProgress] = useState(0); //업로드 로딩 퍼센트 용
  const [selectedFile, setSelectedFile] = useState(null); //선택된 파일 받아오는 함수

  const handleFileInput = (e) => {
    //input 태그에서 저장되는 파일 불러서 저장하는 함수
    setSelectedFile(e.target.files[0]);
    //만약 녹화진행중인 영상 바로 저장할꺼면 e.target.files[0]대신 해당 영상 변수를 넣으면 될 것
  };

  const uploadFile = (file) => {
    //input 태그에 타입이 file이 것의 값을 가져와라
    const params = {
      ACL: "public-read", //공개범위?
      Body: file, //업로드된 파일이 들어갈 자리
      Bucket: S3_BUCKET, //저장될 버켓
      Key: file.name, //파일 이름?
    };

    myBucket
      .putObject(params) //내 버켓에 위에서 설정한 params 를 바탕으로 넣기
      .on("httpUploadProgress", (evt) => {
        setProgress(Math.round((evt.loaded / evt.total) * 100)); //로딩
      })
      .send((err) => {
        if (err) console.log(err);
      });
  };
  // }

  return (
    <div className={styles.room}>
      <LightRope />
      <Crazylights />
      <Musicbar musicbartitle={musicbartitle} />
      <MirrorBall />
      <Screen
        mode={transScreen}
        now={nowPlaymusic}
        // nextMusic={nextMusic}
        setstartScoreBoard={setstartScoreBoard}
        getNowplaying={getNowplaying}
      />
      {openFirework && <Firework />}
      {startDream && <Dream setstartDream={setstartDream} />}
      {startGoodDay && <GoodDay setstartGoodDay={setstartGoodDay} />}
      {startScoreBoard && <ScoreBoard />}

      <div className={transCamBox}>
        {nowMode === "Freemode" ? (
          <div id="video-container" style={{ opacity: Opacity ? "0.6" : "1" }}>
            {session !== undefined ? (
              <Draggable onStart={handleStart} onStop={handleEnd}>
                <div>
                  <UserVideoComponent streamManager={publisher} />
                </div>
              </Draggable>
            ) : null}
            {session !== undefined
              ? subscribers.map((sub, i) => (
                  <div key={i} className="stream-container col-md-6 col-xs-6">
                    <Draggable onStart={handleStart} onStop={handleEnd}>
                      <div>
                        <UserVideoComponent streamManager={sub} />
                      </div>
                    </Draggable>
                  </div>
                ))
              : null}
          </div>
        ) : (
          <div id="video-container">
            {session !== undefined ? (
              <UserVideoComponent streamManager={publisher} />
            ) : null}
            {session !== undefined
              ? subscribers.map((sub, i) => (
                  <div key={i} className="stream-container col-md-6 col-xs-6">
                    <UserVideoComponent streamManager={sub} />
                  </div>
                ))
              : null}
          </div>
        )}
        {/* 켐무빙 */}
      </div>
      <div className={transChatBox}>
        <RoomChat mode={transChat} sendChat={sendChat} chatArr={chatArr} />
      </div>
      <div className={styles.ButtonBox}>
        {audio === true ? (
          <Button text={"마이크 OFF"} getOnClick={audioMute} />
        ) : (
          <Button text={"마이크 ON"} getOnClick={audioMute} />
        )}
        {video === true ? (
          <Button text={"캠 OFF"} getOnClick={videoMute} />
        ) : (
          <Button text={"캠 ON"} getOnClick={videoMute} />
        )}

        {nowMode === "Basicmode" && (
          <Button text={"Singer"} getOnClick={basicsinger} />
        )}
        {nowMode === "Freemode" && (
          <Button text={"Singer"} getOnClick={basicsinger} />
        )}
        {nowMode === "Solomode" && (
          <Button text={"Singer"} getOnClick={solosinger} />
        )}
        {nowMode === "Duetmode" && (
          <Button text={"Singer1"} getOnClick={duetsinger} />
        )}
        {nowMode === "Duetmode" && (
          <Button text={"Singer2"} getOnClick={duetsinger2} />
        )}

        <Controller
          roomseq={room}
          sendYTUrl={sendYTUrl}
          sendMessage={sendMessage}
          setOpenFirework={setOpenFirework}
          voiceFilterEcho={voiceFilterEcho}
          voiceFilterMegaPhone={voiceFilterMegaPhone}
          voiceFilterModulation={voiceFilterModulation}
          setstartDream={setstartDream}
          setstartGoodDay={setstartGoodDay}
          sendClap={sendClap}
          sendTambourine={sendTambourine}
          sendFire={sendFire}
          getNowplaying={getNowplaying}
          nowplaying={nowplaying}
        />
        <button
          className={(styles.btn, styles.neon)}
          onClick={() => {
            setOpenContents(true);
          }}
        >
          {" "}
          컨텐츠{" "}
        </button>
        {openContents && (
          <Contents
            closeContents={setOpenContents}
            sendChangeModeD={sendChangeModeD}
            sendstartDream={sendstartDream}
            sendstartGoodDay={sendstartGoodDay}
          />
        )}

        <button
          className={(styles.btn, styles.neon)}
          onClick={() => {
            setOpenChangeMode(true);
          }}
        >
          {" "}
          모드선택{" "}
        </button>
        {openChangeMode && (
          <ChangeMode
            closeChangeMode={setOpenChangeMode}
            sendChangeModeB={sendChangeModeB}
            sendChangeModeF={sendChangeModeF}
            sendChangeModeS={sendChangeModeS}
            sendChangeModeD={sendChangeModeD}
          />
        )}

        <Link to="/lobby" id={styles.btn_no}>
          <button onClick={leaveRoom} className={(styles.btn, styles.neon)}>
            {" "}
            나가기
          </button>
        </Link>
      </div>
    </div>
  );
}

function mapStateToProps(state) {
  return { state };
}

export default connect(mapStateToProps, null)(Room);