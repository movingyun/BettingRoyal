import * as React from "react";
import Player from "./Player";
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
import card_am_1 from "../../images/cards/card_am_1.png";
import card_aq_1 from "../../images/cards/card_aq_1.png";
import card_back from "../../images/cards/card_back.png";
import GameOpenvidu from "./GameOpenvidu";

export default function Game(props) {
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
  const [preaction,setpreaction]=useState([{},{},{},{},{},{}]);

  let navigate = useNavigate();
  let location = useLocation();
  let roomId = location.state.roomId; //방 컴포넌트에 roomid 포함
  let roomBetUnit = location.state.roomBetUnit;
  var sock = new sockjs("http://localhost:8080/stomp-game");
  let stomp = stompjs.over(sock);

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
          setCurrentMaxBet(content.gameTotalBet);
          setmainMessage("현재 총 베팅 금액 : " + content.gameTotalBet);
        }

        //턴
        if (content.type == "NEXTTURN") {
          setTurn(content.turnIdx);
          setCurrentMaxBet(content.gameTotalBet);
          setPlayers(content.playerInfo);
          setmainMessage("현재 총 베팅 금액 : " + content.gameTotalBet);
          //전사람 행동

          //내턴일때
          if (content.turnIdx == 0) {
            setbuttonDisable([false, false, false, false]);
            let action = new Object();
            action.target.textContent="다이"
            settimer(5,sendBet(action));
    
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
            if (content.playerInfo[0].myruby <= currentBetUnit) {
              leaveGame();
            }
            setwin([false, false, false, false, false, false]);
            setIsStart(false);
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
      console.log("방장만 시작 가능");
    }
  }


  //amount 초 이후 callback 실행
  function settimer(amount,callback) {
    setSec(amount);
    let counter = setInterval(() => {
      setSec(sec-1)
      if (sec <= 0) {
        clearInterval(counter);
      }
    }, 1000);
    callback();
  }

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


  return (
    <div className={styles.container}>
      
      {isEnter && roomInfo && players[0] ? (
        <GameOpenvidu
          roomId={roomId}
          roomInfo={roomInfo}
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
          preaction={preaction}
        />
      ) : null}

      
    </div>
  );
}
