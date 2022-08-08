import { OpenVidu } from "openvidu-browser";
import React, { Component } from 'react';
import axios from 'axios';
import UserVideoComponent from './UserVideoComponent';

const OPENVIDU_SERVER_URL = 'https://' + 'i7a404.p.ssafy.io' + ':8443';
const OPENVIDU_SERVER_SECRET = 'MY_SECRET';


class RoomHome extends Component {
    constructor(props) {            // Component를 생성하때 state 값을 초기화 하거나 메서드를 바인딩할 때 사용
        super(props);               // react.component를 상속한 컴포넌트의 생성자를 구현할때는 super 를 선언을 권고한다 : this.props 사용시 버그발생
        this.state = {              // properties declare
            mySessionId: '접속하고싶은SessionId',
            myUserName: 'UserNickName으로',
            session: undefined,
            mainStreamManager: undefined,       // Main Video Stream
            publisher: undefined,
            subscribers: [],
        };
        this.joinSession = this.joinSession.bind(this);
        this.handleChangeSessionId = this.handleChangeSessionId.bind(this);

    }

    handleChangeSessionId(e) {
        this.setState({
            mySessionId: e.target.value,
        });
    }

    joinSession() {
        // 1. Openvidu object 받아오자
        this.OV = new OpenVidu();
        // 2. Session Init
        this.setState(
            {
            session: this.OV.initSession(),
            },
            () => {// 다음 동작
                // 3. 특정 세션을 따라가자 
                //세션에서 이벤트 발생시 특정 동작 실행
                var mySession = this.state.session;
                // new Stream received
                mySession.on('streamCreated', (event) => {
                    // 수신받기 위해 stream을 구독한다, 2번째 인자는 미정
                    var subscriber = mySession.subscriber(event.stream, undefined);
                    // 보조 배열을 사용 새 스트림을 push
                    var subscribers = this.state.subscribers;
                    subscribers.push(subscriber);
                    // 새로운 구독자들을 update
                    this.setState({
                        subscribers: subscribers,
                    });

                });

                // Stream이 파괴될때 마다
                mySession.on('streamDestroyed', (event) => {
                    event.preventDefault();
                    // subscribers array 에서 stream 을 지운다.
                    this.deleteSubscriber(event.stream.StreamManager);
                });
                // 매 비동기 예외
                mySession.on('exception', (exception) => {
                    console.warn(exception);
                });
                // 4. 유효한 유저 토큰으로 세션 연결
                // getToken 메소드는 back-서버단에서 하는 거 시뮬레이션하는거
                // token은 백에서 반환해야 한다.
                this.getToken().then((token) => {
                    mySession.connect(token, { clientData: this.state.myUserName })
                        .then(() => {
                            // 5. get own camera stream
                            let publisher = this.OV.initPublisher(undefined, {
                                audioSource: undefined,
                                videoSource: undefined,
                                publishAudio: true,
                                publishVideo: true,
                                resolution: '640x480',
                                frameRate: 30,
                                insertMode: 'APPEND',
                                mirror: false
                            });
                            // 6. Pusblish Your stream
                            mySession.publish(publisher);

                            this.setState({
                                mainStreamManager: publisher,
                                publisher: publisher,
                            });
                        })
                        .catch(error => {
                            console.log("Connecting to the session Error:", error.code, error.message);
                        });
                });
            }
        );
    }

    render() {
        const mySessionId = this.state.mySessionId;

        return(
            <div className="container">
                {this.state.session === undefined ? (
                    <div id="join">
                        <h1> Join a video session </h1>
                        <form className="form-group" onSubmit={this.joinSession}>
                            <p>
                                <label> Session: </label>
                                <input
                                    className="form-control"
                                    type="text"
                                    id="sessionId"
                                    value={mySessionId}
                                    onChange={this.handleChangeSessionId}
                                    required
                                />
                            </p>
                            <p className="text-center">
                                <input className="btn btn-lg btn-success" name="commit" type="submit" value="JOIN" />
                            </p>
                        </form>
                    </div>


                ) : null}
                {this.state.session !== undefined ? (
                    <div id="session">
                        <div id="session-header">
                            <h1 id="session-title">{mySessionId}</h1>
                        </div>
                        <div id="video-container" className="col-md-6">
                            {this.state.publisher !== undefined ? (
                                <div className="stream-container col-md-6 col-xs-6" onClick={() => this.handleMainVideoStream(this.state.publisher)}>
                                    <UserVideoComponent
                                        streamManager={this.state.publisher} />
                                </div>
                            ) : null}
                            {this.state.subscribers.map((sub, i) => (
                                <div key={i} className="stream-container col-md-6 col-xs-6" onClick={() => this.handleMainVideoStream(sub)}>
                                    <UserVideoComponent streamManager={sub} />
                                </div>
                            ))}
                        </div>
                    </div>
                ) : null}
            </div>
        );
    }
    // 백으로 대체되어야 한다.
    getToken() {
        return this.createSession(this.state.mySessionId).then((sessionId) => this.createToken(sessionId));
    }
    createSession(sessionId) {
        return new Promise((resolve, reject) => {
            var data = JSON.stringify({ customSessionId: sessionId });
            axios
                .post(OPENVIDU_SERVER_URL + '/openvidu/api/sessions', data, {
                    headers: {
                        Authorization: 'Basic ' + btoa('OPENVIDUAPP:' + OPENVIDU_SERVER_SECRET),
                        'Content-Type': 'application/json',
                    },
                })
                .then((response) => {
                    console.log('CREATE SESION', response);
                    resolve(response.data.id);
                })
                .catch((response) => {
                    var error = Object.assign({}, response);
                    if (error?.response?.status === 409) {
                        resolve(sessionId);
                        console.log("Create Session Catch에서 걸렸다.");
                    } else {
                        console.log(error);
                        console.warn(
                            'No connection to OpenVidu Server. This may be a certificate error at ' +
                            OPENVIDU_SERVER_URL,
                        );
                        if (
                            window.confirm(
                                'No connection to OpenVidu Server. This may be a certificate error at "' +
                                OPENVIDU_SERVER_URL +
                                '"\n\nClick OK to navigate and accept it. ' +
                                'If no certificate warning is shown, then check that your OpenVidu Server is up and running at "' +
                                OPENVIDU_SERVER_URL +
                                '"',
                            )
                        ) {
                            window.location.assign(OPENVIDU_SERVER_URL + '/accept-certificate');
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
                        Authorization: 'Basic ' + btoa('OPENVIDUAPP:' + OPENVIDU_SERVER_SECRET),
                        'Content-Type': 'application/json',
                    },
                })
                .then((response) => {
                    console.log('TOKEN', response);
                    resolve(response.data.token);
                })
                .catch((error) => reject(error));
        });
    }   

}

export default RoomHome;









