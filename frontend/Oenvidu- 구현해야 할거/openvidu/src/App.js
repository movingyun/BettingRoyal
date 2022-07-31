import { useEffect, useState } from "react";
import axios from "axios";
import { Buffer } from "buffer";
import OpenViduSession from "openvidu-react";

// var sock = new sockjs("http://localhost:8080");
// let stomp = stompjs.over(sock)

export default function App(props) {
  const [players, setPlayers] = useState([]);
  const [mySessionId, setMySessionId] = useState("SessionA");
  const [myUserName, setMyUserName] = useState(
    "OpenVidu_User_" + Math.floor(Math.random() * 100)
  );
  const [token, setToken] = useState();
  const [session, setSession] = useState();

  let roomid = props.roomid;

  let OPENVIDU_SERVER_URL = "https://" + window.location.hostname + ":4443";
  let OPENVIDU_SERVER_SECRET = "MY_SECRET";

  function handlerJoinSessionEvent() {
    console.log("Join session");
  }

  function handlerLeaveSessionEvent() {
    console.log("Leave session");
    setSession(undefined);
  }

  function handlerErrorEvent() {
    console.log("Leave session");
  }

  function handleChangeSessionId(e) {
    setMySessionId(e.target.value);
  }

  function handleChangeUserName(e) {
    setMyUserName(e.target.value);
  }

  function joinSession(event) {
    
    if (mySessionId && myUserName) {
      getToken().then((token) => {
        setToken(token);
        setSession(true);
      });
      event.preventDefault();
    }
  }

  function getToken() {
    return createSession(mySessionId)
      .then((sessionId) => createToken(sessionId))
      .catch((Err) => console.error(Err));
  }

  function createSession(sessionId) {
    return new Promise((resolve, reject) => {
      var data = JSON.stringify({ customSessionId: sessionId });
      axios
        .post(OPENVIDU_SERVER_URL + "/openvidu/api/sessions", data, {
          headers: {
            Authorization:
              "Basic " +
              Buffer.toString("OPENVIDUAPP:" + OPENVIDU_SERVER_SECRET),
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          console.log("CREATE SESION", response);
          resolve(response.data.id);
        })
        .catch((response) => {
          var error = Object.assign({}, response);
          if (error.response && error.response.status === 409) {
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
                OPENVIDU_SERVER_URL + "/openvidu/accept-certificate"
              );
            }
          }
        });
    });
  }

  function createToken(sessionId) {
    return new Promise((resolve, reject) => {
      var data = JSON.stringify({});
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
          resolve(response.data.token);
        })
        .catch((error) => reject(error));
    });
  }

  return (
    <div>
      <br></br>
      <div>
        {session === undefined ? (
          <div id="join">
            <div id="join-dialog">
              <h1> Join a video session </h1>
              <form >
                <p>
                  <label>Participant: </label>
                  <input
                    type="text"
                    id="userName"
                    value={myUserName}
                    onChange={handleChangeUserName}
                    required
                  />
                </p>
                <p>
                  <label> Session: </label>
                  <input
                    type="text"
                    id="sessionId"
                    value={mySessionId}
                    onChange={handleChangeSessionId}
                    required
                  />
                </p>
                <p>
                  <input name="commit" type="button" onClick={joinSession} value="JOIN" />
                </p>
              </form>
            </div>
          </div>
        ) : (
          <div id="session">
            <OpenViduSession
              id="opv-session"
              sessionName={mySessionId}
              user={myUserName}
              token={token}
              joinSession={handlerJoinSessionEvent}
              leaveSession={handlerLeaveSessionEvent}
              error={handlerErrorEvent}
            />
          </div>
        )}
      </div>
    </div>
  );
}
