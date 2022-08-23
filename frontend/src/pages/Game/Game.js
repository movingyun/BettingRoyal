import * as React from "react";
import { useEffect, useState, useRef } from "react";
import styles from "./Game.module.css";
import ArrowForwardIosRoundedIcon from "@mui/icons-material/ArrowForwardIosRounded";
import sockjs from "sockjs-client";
import stompjs, { setInterval } from "stompjs";
import axios from "axios";
import { listClasses } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import ruby_win from "../../images/ruby/ruby_win.gif";
import MicRoundedIcon from "@mui/icons-material/MicRounded";
import VideocamRoundedIcon from "@mui/icons-material/VideocamRounded";
// import Test  from "../../components/Audio/Test";

import card1 from "../../images/cards/1.png";
import card2 from "../../images/cards/2.png";
import card3 from "../../images/cards/3.png";
import card4 from "../../images/cards/4.png";
import card5 from "../../images/cards/5.png";
import card6 from "../../images/cards/6.png";
import card7 from "../../images/cards/7.png";
import card8 from "../../images/cards/8.png";
import card9 from "../../images/cards/9.png";
import card10 from "../../images/cards/10.png";
import card11 from "../../images/cards/11.png";
import card12 from "../../images/cards/12.png";
import card13 from "../../images/cards/13.png";
import card14 from "../../images/cards/14.png";
import card15 from "../../images/cards/15.png";
import card16 from "../../images/cards/16.png";
import card17 from "../../images/cards/17.png";
import card18 from "../../images/cards/18.png";
import card19 from "../../images/cards/19.png";
import card20 from "../../images/cards/20.png";
import card21 from "../../images/cards/21.png";
import card22 from "../../images/cards/22.png";
import card23 from "../../images/cards/23.png";
import card24 from "../../images/cards/24.png";
import card25 from "../../images/cards/25.png";
import card26 from "../../images/cards/26.png";
import card27 from "../../images/cards/27.png";
import card28 from "../../images/cards/28.png";
import card29 from "../../images/cards/29.png";
import card30 from "../../images/cards/30.png";
import card31 from "../../images/cards/31.png";
import card32 from "../../images/cards/32.png";
import card33 from "../../images/cards/33.png";
import card34 from "../../images/cards/34.png";
import card35 from "../../images/cards/35.png";
import card36 from "../../images/cards/36.png";
import card37 from "../../images/cards/37.png";
import card38 from "../../images/cards/38.png";
import card39 from "../../images/cards/39.png";
import card40 from "../../images/cards/40.png";
import GameOpenvidu from "./GameOpenvidu";

export default function Game(props) {
  const [playerOpenvidu, setPlayerOpenvidu] = useState([]);
  const [players, setPlayers] = useState([]);
  const [turn, setTurn] = useState();
  const [currentBetUnit, setCurrentBetUnit] = useState(0);
  const [currentMaxBet, setCurrentMaxBet] = useState(0);
  const [myBet, setMyBet] = useState(0);
  const [raiseCnt, setRaiseCnt] = useState(0);
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
  const [preaction, setpreaction] = useState([{}, {}, {}, {}, {}, {}]);

  let navigate = useNavigate();
  let location = useLocation();
  let roomId = location.state.roomId; //방 컴포넌트에 roomid 포함
  let roomBetUnit = location.state.roomBetUnit;
  let roomTitle = location.state.roomTitle;
  var sock = new sockjs("https://i7a404.p.ssafy.io/stomp-game");
  let stomp = stompjs.over(sock);

  const startButton = new Audio("./Audio/StartButton.mp3");
  const startGame = new Audio("./Audio/StartGame.mp3");
  const Shuffling = new Audio("./Audio/Shuffling.mp3");
  const clickBet = new Audio("./Audio/Click.mp3");
  const flipCard = new Audio("./Audio/Flip.mp3");
  const lubbySound = new Audio("./Audio/Lubby.mp3");
  const endGame = new Audio("./Audio/EndGame.mp3");

  function startbutton() {
    startButton.play();
  }
  function startgame() {
    startGame.play();
    Shuffling.play();
  }
  function betting() {
    clickBet.play();
  }
  function flip() {
    flipCard.play();
  }
  function endgame() {
    lubbySound.play();
    endGame.play();
  }

  function kicksession(props) {
    props.leavesession();
  }

  useEffect(() => {
    console.log(roomId + "번 방 참가");
    setCurrentBetUnit(roomBetUnit);
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
          console.log("exit")
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
          setpreaction([{}, {}, {}, {}, {}, {}]);
          startbutton();
          startgame();
          setIsStart(true);
          // let action = new Object();
          // action.target = new Object();
          // action.target.textContent = "다이";
          // settimer(5, sendBet(action));
          // setSec(5);
          //카메라 체크
        }

        //그라운드 카드 받을 때
        if (content.type == "GROUNDCARD") {
          //message : {"공통카드 : card1, card2"}
          console.log("그라운드카드 받아라~" + content.message);
          setCurrentMaxBet(content.gameMaxBet);
          flip();
        }

        //수시로 서버와 동기화
        if (content.type == "SYNC") {
          //{betUnit, players[], }
          setPlayers(content.playersInfo);
          //setCurrentBetUnit(content.betUnit);
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
          //setCurrentBetUnit(content.battingUnit);
          // setCurrentMaxBet(content.gameTotalBet);
          setGameTotalBet(content.gameTotalBet);
          setMyBet(roomBetUnit);
          setGroundCard1(content.groundCardNum1);
          setGroundCard2(content.groundCardNum2);
          setCurrentMaxBet(content.gameMaxBet);
          setmainMessage(content.mission);
          setRaiseCnt(content.battingUnit);
          setTurn(content.turnIdx);
        }

        //턴
        if (content.type == "NEXTTURN") {
          //전사람 행동
           console.log(preaction);
          let preturn = content.preTurnIdx;
          let temppreaction = preaction;
          let act = content.message.split(" ", 1);
          console.log(act);
          temppreaction[preturn] = new Object();
          temppreaction[preturn].action = act[0];
          // if (act === "RAISE") {
          //   temppreaction[preturn].amount = content.message.split(" ")[1];
          // }
          setMyBet(content.gameMaxBet);
          setCurrentBetUnit(content.gameMaxBet);
          setCurrentMaxBet(content.gameMaxBet);
          // setCurrentMaxBet(content.gameMaxBet)
          setpreaction(temppreaction);
          setGameTotalBet(content.gameTotalBet);
          setTurn(content.turnIdx);
          // setCurrentMaxBet(content.gameTotalBet);
          setPlayers(content.playerInfo);
          // setmainMessage("현재 총 베팅 금액 : " + content.gameTotalBet);

          //내턴일때
          if (content.turnIdx == 0) {
            setbuttonDisable([false, false, false, false]);
            // let action = new Object();
            // action.target = new Object();
            // action.target.textContent = "다이";
            // settimer(5, sendBet(action));
            // setSec(5);
          }
          //다른사람 턴일때
          else {
            setbuttonDisable([true, true, true, true]);
          }
        }

        //게임 끝
        if (content.type == "GAMEEND") {
          // let turn = content.preTurnIdx;
          let temppreaction = preaction;
          let act = content.message.split(" ", 1);
          console.log(act);
          console.log(turn);
          temppreaction[turn] = new Object();
          temppreaction[turn].action = act[0];
          // if (act === "RAISE") {
          //   temppreaction[preturn].amount = content.message.split(" ")[1];
          // }
          setpreaction(temppreaction);

          setbuttonDisable([true, true, true, true]);
          setPlayers(content.playerInfo);
          setTurn(content.turnIdx);
          //이긴사람 표시
          setmainMessage(content.playerInfo[content.winnerIdx].nickname + " 승리!!");
          setCurrentBetUnit(roomBetUnit);
          let tempwin = [false, false, false, false, false, false];
          tempwin[content.winnerIdx] = true;
          setwin(tempwin);
          flip();
          endgame();

          //2.5초간 효과재생 후 게임시작 활성화
          setTimeout(() => {
            if (content.playerInfo[0].myruby <= currentBetUnit) {
              charge();
              kick()
              // kicksession();
            }
            setwin([false, false, false, false, false, false]);
            setIsStart(false);
            setMyBet(roomBetUnit);
            setGameTotalBet(0);
            setpreaction([{}, {}, {}, {}, {}, {}]);
            console.log(win);
          }, 2500);
        }
      });
    });
    return () => {
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

  const [sec, setSec] = useState(0);
  const time = useRef(30); // 30초타이머
  const timerId = useRef(null);
  const [isStart, setIsStart] = React.useState(false);

  // useEffect(() => {
  //   if (time.current <= 0) {
  //     console.log("끝");
  //     clearInterval(timerId.current);
  //   }
  // }, [sec]);

  useEffect(() => {
    console.log(groundCard1);
  }, [groundCard1]);

  function gameStart(e) {
    if (turn == 0 && players[1]) {
      console.log("겜시작");
      setIsStart(true);

      stomp.send(
        "/pub/game/message",
        {},
        JSON.stringify({ roomId: roomId, message: "", sender: "", type: "START" })
      );
    } else {
      if (!players[1]) console.log("플레이어가 부족합니다");
      if (turn != 0) console.log("방장만 시작 가능");
    }
  }

  async function charge() {
    let userId;
    // await axios
    //   .get("/api/user", {
    //     headers: {
    //       Authorization: window.localStorage.accessToken,
    //       "Content-Type": "application/json",
    //     },
    //   })
    //   .then((response) => {
    //     console.log(JSON.stringify(response.data.userEmail));
    //     userId = response.data.userId;
    //   });

    await axios
      .put(
        "/api/user/charge",
        {},
        {
          headers: {
            "Content-Type": "application/json; charset=utf-8",
            Authorization: window.localStorage.accessToken,
          },
        }
      )
      .then((response) => {
        console.log("50루비 충전");
      })
      .catch((error) => {
        console.log(error);
      });
  }

  useEffect(() => {
    console.log(preaction);
    // setCurrentMaxBet(preaction)
  }, [preaction]);

  useEffect(() => {
    // let second = amount;
    //setSec(amount);
    console.log(sec);
    setTimeout(() => {
      if (turn == 0) {
        if (sec <= 0) {
          let action = new Object();
          action.target = new Object();
          action.target.textContent = "다이";
          sendBet(action);
        } else {
          setSec(sec - 1);
        }
      }
    }, 1000);
  }, [sec]);

  //타이머를 위한
  useEffect(() => {
    // console.log(turn);
    // if (turn == 0 && isStart) {
    //   setSec(5);
    // }
  }, [turn]);

  //amount 초 이후 callback 실행
  function settimer(amount, callback) {
    let second = amount;
    //setSec(amount);
    let counter = setInterval(() => {
      second--;
      if (second <= 0) {
        clearInterval(counter);
      }
    }, 1000);
    callback();
  }

  //콜 다이 레이즈 올인 클릭
  function sendBet(action) {
    //call die raise allin

    betting();
    console.log(action.target.textContent);
    if (action.target.textContent[0] == "콜") {
      action.target.textContent = "콜";
    }

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
        // setMyBet(currentBetUnit);
        console.log("raise " + raiseCnt);
        stomp.send(
          "/pub/game/message",
          {},
          JSON.stringify({
            roomId: roomId,
            message: raiseCnt,
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
    navigate("../lobby/rooms");
  }

  function kick(){
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
    navigate("../lobby/rooms",{state:true});
  }

  function setMyBetAmount(change, raiseCount) {
    console.log(myBet);
    if (change == "up") {
      console.log("+ currentBetUnit");
      setRaiseCnt(raiseCount);
    } else {
      console.log("- currentBetUnit");
      setRaiseCnt(raiseCount);
    }
  }
  return (
    <div className={styles.container}>
      {isEnter && roomInfo && players[0] ? (
        <GameOpenvidu
          roomId={roomId}
          roomInfo={roomInfo}
          roomTitle={roomTitle}
          players={players}
          leavegame={leaveGame}
          win={win}
          sendBet={sendBet}
          gameStart={gameStart}
          stomp={stomp}
          sessionId={sessionId}
          turn={turn}
          isStart={isStart}
          buttonDisable={buttonDisable}
          startDisabled={startDisabled}
          myBet={myBet}
          currentBetUnit={roomBetUnit}
          currentMaxBet={currentMaxBet}
          preaction={preaction}
          sec={sec}
          gameTotalBet={gameTotalBet}
          setMyBetAmount={setMyBetAmount}
          groundCard1={groundCard1}
          groundCard2={groundCard2}
          mainMessage={mainMessage}
          navigate={navigate}
        />
      ) : null}
    </div>
  );
}
