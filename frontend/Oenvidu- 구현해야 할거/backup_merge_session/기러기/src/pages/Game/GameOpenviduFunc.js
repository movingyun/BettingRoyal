import axios from 'axios';
import { OpenVidu } from 'openvidu-browser';
import React, { Component } from 'react';
import UserVideoComponent from '../../components/Openvidu/UserVideo';
import Chat from '../../components/Openvidu/Chat'
import styles from "./GameOpenvidu.module.css";
import { useEffect, useState } from "react";
import ArrowForwardIosRoundedIcon from '@mui/icons-material/ArrowForwardIosRounded';
import card_am_1 from "../../images/cards/card_am_1.png";
import card_aq_1 from "../../images/cards/card_aq_1.png";
import card_back from "../../images/cards/card_back_logo.png";
import Popover from "react-popover";
import HelpOutlineRoundedIcon from '@mui/icons-material/HelpOutlineRounded';
import ruby from "../../images/icon/ruby.png";

const OPENVIDU_SERVER_URL = 'https://' + 'i7a404.p.ssafy.io' + ':8443';
const OPENVIDU_SERVER_SECRET = 'MY_SECRET';


export default function Gameroom(props) {
    const [mySessionId, setMySessionId] = useState('test_expression');
    const [myUserName, setMyUserName] = useState('Participant' + Math.floor(Math.random() * 100));
    const [session, setSession] = useState(undefined);
    const [mainStreamManager, setMainStreamManager] = useState(undefined);
    const [publisher, setPublisher] = useState(undefined);
    const [subscribers, setSubscribers] = useState([]);
    const [chatList, setChatList] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [seconds, setSeconds] = useState(30);
    const [currentVideoDevice, setCurrentVideoDevice] = useState(undefined);
    const [OV, setOV] = useState(undefined)

    var test = [
        styles.player1,
        styles.player2,
        styles.player3,
        styles.player4,
        styles.player5,
    ]


    // leave session 수정 필요

    window.onbeforeunload = function () {
        onbeforeunload();
      };

    function onbeforeunload() {
        leaveSession();
    }

    function leaveSession() {
        const mySession = session;
        if (mySession) {
            mySession.disconnect();
        }
        setOV(undefined);
        setSession(undefined);
        setSubscribers([]);
        setMySessionId(undefined);
        setMyUserName(undefined);
        setPublisher(undefined);




    }

    function deleteSubscriber(streamManager) {
        let subs = subscribers;
        let index = subs.indexOf(streamManager, 0);
        if (index > -1) {
          subs.splice(index, 1);
          setSubscribers([...subs]);
        }
    };


    function getToken() {
        return createSession(mySessionId).then((sessionId) => createToken(sessionId));
    }

    function createSession(sessionId) {
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

    function createToken(sessionId) {
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

    // useEffect(() => {
    //     var OV = new OpenVidu();
    //     setSession(OV.initSession())
    // }, [])

    function handleChangeUserName(e) {
        setMyUserName(e.target.value)
    }
    
    function handleChangeSessionId(e) {
        setMySessionId(e.target.value)
    }

    function joinSession() {
        var OV = new OpenVidu();
        setOV(OV);
        setSession(OV.initSession())
        console.log('console : joinsession')
        console.log("$$$$$$$$$$$$$$$$" + subscribers)
    }
    
    function handleMainVideoStream(stream) {
        if (mainStreamManager !== stream) {
            setMainStreamManager(stream)
            console.log('console : handleMainVideoStream')

        }
    }

    // useEffect(()=> {
    //     setSubscribers(subscribers);
    // },[subscribers])

    useEffect(() => {
        if(session !== undefined) {//&& OV !== undefined)
            var mySession = session;
            mySession.on("streamCreated", (event) => {
                // Subscribe to the Stream to receive it. Second parameter is undefined
                // so OpenVidu doesn't create an HTML video by its own
                var Subscriber = mySession.subscribe(event.stream, undefined);
                var subs = subscribers;
                subs.push(Subscriber);
                setSubscribers(subs);
            });
            mySession.on("streamDestroyed", (event) => {
                // Remove the stream from 'subscribers' array
                deleteSubscriber(event.stream.streamManager);
            });
            mySession.on("exception", (exception) => {
                console.warn(exception);
            });

            getToken().then((token) => {
                mySession
                .connect(
                    token,
                    { clientData: myUserName },
                )
                .then(async () => {
                    var devices = await OV.getDevices();
                    var videoDevices = devices.filter(device => device.kind === 'videoinput');
                    let publisher = OV.initPublisher(undefined, {
                        audioSource: undefined, // The source of audio. If undefined default microphone
                        videoSource: videoDevices[0].deviceId, // The source of video. If undefined default webcam
                        publishAudio: true, // Whether you want to start publishing with your audio unmuted or not
                        publishVideo: true, // Whether you want to start publishing with your video enabled or not
                        resolution: '640x480', // The resolution of your video
                        frameRate: 30, // The frame rate of your video
                        insertMode: 'APPEND', // How the video is inserted in the target element 'video-container'
                        mirror: false, // Whether to mirror your local video or not
                    });
                    mySession.publish(publisher);
                    setMainStreamManager(publisher)
                    setPublisher(publisher)
                    setCurrentVideoDevice(videoDevices[0])
                })
                .catch((error) => {
                    console.log('There was an error connecting to the session:', error.code, error.message);
                });
            });
        }
    }, [session])

    return (
        <div className={styles.container}>
                    
            {/* 입장 전 */}
            {session === undefined ? (
                <div id="join">
                    {/* <p>게임방을 클릭하여 입장하는 단계, nickname, session(방만들때 생성되는 id로 설정??) 등 DB에서 가져오자</p> */}
                    <div id="join-dialog" className="jumbotron vertical-center">
                        {/* <h1> Join a video session </h1> */}
                        <form className="form-group" onSubmit={joinSession}>
                            <p>
                                <label>Participant: </label>
                                <input
                                    className="form-control"
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
                                    className="form-control"
                                    type="text"
                                    id="sessionId"
                                    value={mySessionId}
                                    onChange={handleChangeSessionId}
                                    required
                                />
                            </p>
                            <p className="text-center">
                                <input className="btn btn-lg btn-success" name="commit" type="submit" value="JOIN" />
                            </p>
                        </form>
                    </div>
                </div>
                ) : null}

            {/* 입장 후 */}

            <div className={styles.header}>
                <h1>
                    <ArrowForwardIosRoundedIcon className={styles.icon} />
                    게임방 이름
                </h1>
                <h2>기본 베팅 10 루비</h2>
                <div className={styles.buttonList}>
                <button className={styles.button} onClick={leaveSession}>나가기</button>
                </div>
            </div>
            {session !== undefined ? (
                <div className={styles.grid}>
                    {publisher !== undefined ? (
                        <div onClick={() => handleMainVideoStream(publisher)} className={styles.myCam}>
                            <UserVideoComponent
                                streamManager={publisher}/>
                        </div>
                    ) : null}
                    {subscribers.map((sub, i) => (
                        <div key={i} onClick={() => handleMainVideoStream(sub)} className={test[i]}>
                            <UserVideoComponent streamManager={sub}/>
                            {/* 타 플레이어 게임 이길시*/}
                            {/* <img src={ruby_get} className={styles.rubyGet}/> */}
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
                        {/* 베팅시*/}
                        {/* <img src={ruby_bet} className={styles.rubyBet}/> */}
                        {/* 내가 게임 이길시*/}
                        {/* <img src={ruby_win} className={styles.rubyWin}/> */}
                        <div className={styles.info}>
                            {/* <div className={styles.time}>
                                {this.state.seconds}초
                            </div> */}
                            <div className={styles.ruby}>
                                <img src={ruby} className={styles.rubyImg}/>
                                <p className={styles.rubyNum}>1,000,000</p>
                                </div>
                            <div className={styles.help}>
                                {/* <Popover
                                isOpen={isOpen}
                                body={
                                    <div className={styles.popover}>
                                        더블 &#60; 스트레이트 &#60; 트리플<br />
                                        자수정 &#60; 아쿠아마린 &#60; 다이아몬드 &#60; 에메랄드
                                    </div>
                                }
                                onOuterAction={this.togglePopover}
                                >
                                    <HelpOutlineRoundedIcon className={styles.popoverBtn} onClick={this.togglePopover}/>
                                </Popover> */}
                            </div>
                        </div>
                    </div>
                    {/* <div className={styles.chat}>
                        <Chat sendChat={this.sendChat} chatList={chatList} />
                    </div> */}
                    {/* 게임시작버튼 */}
                    {/* <div className={styles.start}>
                        <button onClick={this.startClick}>게임시작</button>
                    </div> */}
                    {/* 베팅버튼 */}
                    <div className={styles.betting}>
                        <button>다이</button>
                        <button>콜</button>
                        <div className={styles.betList}>
                            <p>레이즈</p>
                            <input className={styles.betInput} type={"number"} step="10" placeholder='베팅 루비 입력'></input>
                            <button className={styles.betBtn}>확인</button>
                        </div>
                        <button>올인</button>
                    </div>
                </div>
                ) : null}
        </div>
    );
}
