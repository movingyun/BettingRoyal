import * as React from "react";
import Player from "./Player";
import { useEffect, useState, useRef } from "react";
import styles from "./Game.module.css";
import ArrowForwardIosRoundedIcon from "@mui/icons-material/ArrowForwardIosRounded";
import sockjs from "sockjs-client";
import stompjs from "stompjs";
import axios from "axios";
import { listClasses } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";

import MicRoundedIcon from "@mui/icons-material/MicRounded";
import VideocamRoundedIcon from "@mui/icons-material/VideocamRounded";
import card_am_1 from "../../images/cards/card_am_1.png";
import card_aq_1 from "../../images/cards/card_aq_1.png";
import card_back from "../../images/cards/card_back.png";
import GameOpenvidu from "./GameOpenvidu";

export default function Game(props) {
  const [playerOpenvidu, setPlayerOpenvidu] = useState([]);
  const [players, setPlayers] = useState([]);
  //player { socketId, nickname, ruby, bet, myCard, pair}
  //const [myCard, setMyCard] = useState([]);
  const [currentBetUnit, setCurrentBetUnit] = useState(0);
  const [currentMaxBet, setCurrentMaxBet] = useState(0);
  const [myBet, setMyBet] = useState(0);
  const [myTotalBet, setMyTotalBet] = useState(0);
  const [mainMessage, setmainMessage] = useState("");
  const [buttonDisable, setbuttonDisable] = useState([true,true,true,true]);
 
  const [gameTotalBet, setGameTotalBet] = useState(0);
  const [groundCard1, setGroundCard1] = useState(0);
  const [groundCard2, setGroundCard2] = useState(0);

  let navigate = useNavigate();
  let location = useLocation();
  let roomId = location.state.roomId; //방 컴포넌트에 roomid 포함
  var sock = new sockjs("http://localhost:8080/stomp-game");
  let stomp = stompjs.over(sock);

  useEffect(() => {
    console.log(roomId + "번 방 참가");

    stomp.connect({}, () => {
      stomp.send(
        "/pub/game/message",
        {},
        JSON.stringify({ roomId: roomId, sender: "유동윤", type: "ENTER" })
      );

      //메시지를 받으면
      stomp.subscribe("/sub/game/room" + roomId, function (message) {
        //content.type, content.message등으로 사용 가능
        var content = JSON.parse(message.body);

        // //참가 후 정보받기
        // if (content.type == "PLAYERSINFO") {
        //   //{players[], betUnit}
        //   //받은 player[0]이 자신
        //   console.log('플레이어들 정보 받기' +content.playersInfo)
        //   setPlayers(content.playersInfo);
        //   setPlayerOpenvidu(content.playerOpenvidu);
        // }

        //사람이 들어왔을 때
        if (content.type == "ENTER") {
          //nickname , ruby
          console.log("사람들어왔다" + JSON.stringify(content.playerInfo));
          if (content.playerInfo) {
            setPlayers(content.playerInfo);
          }
        }

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
          //ui 게임ui로 바뀜. 버튼생성
          setmainMessage("게임 시작!")

          //카메라 체크
        }

        //그라운드 카드 받을 때
        if (content.type == "GROUNDCARD") {
          //message : {"공통카드 : card1, card2"}
          console.log("그라운드카드 받아라~" + content.message);

          setGroundCard1(content.groundCardNum1);
          setGroundCard2(content.groundCardNum2);
        }

        // 배팅 하자
        if (content.type == "UNITBETTING") {
          //서버에서 베팅 처리하고 프론트 효과만
          //
          setPlayers(
            players.map((player) => {
              player.myruby -= currentBetUnit;
              player.mytotalBet += currentBetUnit;
              return player;
            })
          );
          setGameTotalBet(gameTotalBet + content.gameTotalBet);
        }

        //플레이어 카드 받기
        if (content.type == "MAKECARDSET") {
          //{players[]}

          setPlayers(content.playerInfo);

          //10초 대화
          setmainMessage("10초 후 베팅이 시작됩니다");
          setInterval(() => {
            setSec(time.current);
            time.current -= 1;
          }, 1000);
        }

        //턴
        if (content.type == "TURN") {
          //내턴일때
          if (content.turnIdx == 0) {
            setbuttonDisable([false,false,false,false]);
            if (currentMaxBet > myTotalBet) {
              //콜 버튼 비활성화
              setbuttonDisable([false,true,false,false]);
            }
          }
          //다른사람 턴일때
          else {
            setbuttonDisable([true,true,true,true]);
          }
        }

        //수시로 서버와 동기화
        if (content.type == "SYNC") {
          //{betUnit, players[], }
          setPlayers(content.playersInfo);
          setCurrentBetUnit(content.betUnit);
        }
      });
    });

    return () => {
      //컴포넌트 unmount 시
      stomp.send(
        "/pub/game/message",
        {},
        JSON.stringify({ roomId: roomId, message: "", sender: "", type: "EXIT" })
      );
    };
  }, []);

  const [sec, setSec] = useState(0);
  const time = useRef(30); // 30초타이머
  const timerId = useRef(null);
  const [isStart, setIsStart] = React.useState(false);

  useEffect(() => {
    if (time.current <= 0) {
      console.log("끝");
      clearInterval(timerId.current);
    }
  }, [sec]);

  function gameStart(e) {
    console.log("겜시작");
    setIsStart(true);

    stomp.send(
      "/pub/game/message",
      {},
      JSON.stringify({ roomId: roomId, message: "", sender: "", type: "START" })
    );

    // // 타이머 시작
    // timerId.current = setInterval(() => {
    //   setSec(time.current-1);
    //   time.current -= 1;
    // }, 1000);

    // return () => clearInterval(timerId.current);
  }

  function settimer(amount) {}

  //콜 다이 레이즈 올인 클릭
  function sendBet(action) {
    //call die raise allin
    console.log(action.target.textContent)
    switch (action.target.textContent) {
      case "콜":
        console.log("z");
        stomp.send(
          "/pub/game/message",
          {},
          JSON.stringify({ roomId: roomId, message: "", sender: "", type: "CALL" })
        );

        break;
      case "레이즈":
        console.log("raise " + myBet);
        stomp.send(
          "/pub/game/message",
          {},
          JSON.stringify({ roomId: roomId, message: myBet, sender: "", type: "RAISE" })
        );

        break;
      case "올인":
        console.log("allin ");
        stomp.send(
          "/pub/game/message",
          {},
          JSON.stringify({ roomId: roomId, message: "", sender: "", type: "ALLIN" })
        );

        break;
      case "다이":
        console.log("die");
        stomp.send(
          "/pub/game/message",
          {},
          JSON.stringify({ roomId: roomId, message: "", sender: "", type: "DIE" })
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
        JSON.stringify({ roomId: roomId, message: "", sender: "", type: "EXIT" })
      );
      navigate("../lobby");
    } else {
    }
  }

  //클라이언트 webrtc socket on:
  //클라이언트 game socket emit : bet, call, raise, die , 나가기, 참가,
  //클라이언트 game socket on : 내 카드 받기, 공통카드 받기, 차례 받기,
  //클라이언트 api 요청:
  //새로고침시 로비로
  //주기적으로 동기화

  return (
    <div className={styles.container}>
      {/* <div className={styles.header}>
        <h1>
          <ArrowForwardIosRoundedIcon className={styles.icon} />
          게임방 이름
        </h1>
        <h2>기본 베팅 10 루비</h2>
        <div className={styles.buttonList}>
          <button className={styles.button}>관전자모드</button>
          <button className={styles.button} onClick={leaveGame}>
            나가기
          </button>
        </div>
      </div> */}
      {/* <div className={styles.grid}>
        <div className={styles.center}>
<<<<<<< HEAD
          <div className={styles.qs}>누가 거짓말쟁이?</div>
          <div className={styles.cards}> */}
            {/* <div
=======
          <div className={styles.qs}>{mainMessage}</div>
          <div className={styles.cards}>
            {/* 카드뒷면 */}
            <div
>>>>>>> e287f85111a98e14b5330e9e70fd809bd5808b75
              id="card"
              className={`${styles.cards_back} ${isStart ? styles.flip_back : styles.none}`}
            >
              <img src={card_back} />
              <img src={card_back} />
<<<<<<< HEAD
            </div> */}
            {/* <div className={`${styles.cards_front} ${isStart ? styles.flip_front : styles.none}`}>
              <img src={card_am_1} />
              <img src={card_aq_1} />
=======
            </div>
            {/* 카드앞면오픈 */}
            <div className={`${styles.cards_front} ${isStart ? styles.flip_front : styles.none}`}>
              <img src={groundCard1} />
              <img src={groundCard2} />
>>>>>>> e287f85111a98e14b5330e9e70fd809bd5808b75
            </div>
          </div>
          <div className={styles.info}>
            <div className={styles.time}>
              {sec}초 */}
              {/* <div className={styles.timer_front}></div>
                        <div className={styles.timer_back}></div> */}
            {/* </div>
            <div className={styles.money}>돈돈돈돈</div>
          </div>
        </div> */}
{/* 
        <div className={styles.player1}>
          <Player player={players[1]} />
        </div>
        <div className={styles.player2}>
          <Player player={players[2]} />
        </div>
        <div className={styles.player3}>
          <Player player={players[3]} />
        </div>
        <div className={styles.player4}>
          <Player player={players[4]} />
        </div>
        <div className={styles.player5}>
          <Player player={players[5]} />
        </div>
        <div className={styles.playerMe}>
          <Player player={players[0]} />
        </div> */}
        <GameOpenvidu />
<<<<<<< HEAD
        {/* 게임시작버튼
        <div className={styles.start}>
          <button onClick={gameStart}>게임시작</button>
        </div> */}
        {/* 베팅버튼 */}
        {/* <div className={styles.betting}>
                <button>다이</button>
                <button>콜</button>
                <button>레이즈</button>
                <button>올인</button>
            </div> */}
        {/* <div className={styles.rules}>
=======
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
            <button onClick={gameStart}>게임시작</button>
          </div>
        )}

        <div className={styles.rules}>
>>>>>>> e287f85111a98e14b5330e9e70fd809bd5808b75
          트리플 &#62; 스트레이트 &#62; 더블 <br />
          에메랄드 &#62; 다이아몬드 &#62; 아쿠아마린 &#62; 자수정
        </div> */}
      {/* </div> */}
    </div>
  );
}
