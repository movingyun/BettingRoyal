import * as React from "react";
import Player from "./Player";
import { useEffect, useState } from "react";
import styles from "./Game.module.css";
import ArrowForwardIosRoundedIcon from "@mui/icons-material/ArrowForwardIosRounded";
import sockjs from "sockjs-client";
import stompjs from "stompjs";
import axios from "axios";
import { listClasses } from "@mui/material";

import MicRoundedIcon from "@mui/icons-material/MicRounded";
import VideocamRoundedIcon from "@mui/icons-material/VideocamRounded";

export default function Game(props) {
  const [playerOpenvidu, setPlayerOpenvidu] = useState([]);
  const [players, setPlayers] = useState([]);
  //player { socketId, nickname, ruby, bet, myCard, pair}
  const [myCard, setMyCard] = useState([]);
  const [totalBet, setTotalBet] = useState([]);
  const [groundCard, setGroundCard] = useState([]);

  let roomId = ""; //방 컴포넌트에 roomid 포함
  let stomp;
  useEffect(() => {
    var sock = new sockjs("http://localhost:8080");
    stomp = stompjs.over(sock);
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


        //참가 후 정보받기
        if (content.type == "PLAYERSINFO") {
          //받은 player[0]이 자신
          setPlayers(content.playersInfo);
          setPlayerOpenvidu(content.playerOpenvidu)
          //playerinfo {  nickname, ruby  }
        }


        //사람이 들어왔을 때
        if (content.type == "ENTER") {
          console.log("사람들어왔다" + message.body);
          setPlayers([...players, content.playerInfo]);
          //playerinfo {  nickname, ruby  }
        }

        //사람이 나갔을 때
        if (content.type == "ENTER") {
          let leftPlayer = players.find((player) => player.socketId == content.socketId);
          setPlayers(players.filter((player) => player.socketId != content.socketId));
          console.log(leftPlayer.nickname + " left");
          //playerinfo {  nickname, ruby  }
        }

        //게임이 시작됐을 때
        if (content.type == "START") {
          console.log("게임시작하자" + content.message);
          //카메라 체크
          //기본베팅
        }

        //그라운드 카드 받을 때
        if (content.type == "GROUNDCARD") {
          console.log("그라운드카드 받아라~" + content.message);
          setGroundCard(content.groundCard);
        }

        //기본 배팅 하자
        if (content.type == "UNITBETTING") {
          //setPlayers(content.playerInfo);
          
          setPlayers(players.map(
            player => player.socketId === content.socketId
            ? {...player, bet: content.bet}
            : player
          ))
          setTotalBet(totalBet+content.bet)
        }

        //카드 받자 player수만큼 요청하자
        if (content.type == "MAKECARDSET") {
          console.log("개인카드 달라고 요청했음");
          //기본배팅 했으니까 GETCARD 요청
          stomp.send(
            "/pub/game/message",
            {},
            JSON.stringify({
              roomId: roomId,
              message: "",
              sender: "",
              type: "GETMYCARD",
            })
          );
        }

        //카드 만들어서 요청 넘어왔으면 찍어주자
        if (content.type == "GETMYCARD") {
          console.log("개인카드 받았다.");
          //무슨 카드를 받았나?
        }
      });
    });

    return ()=>{
      //컴포넌트 unmount 시
      stomp.send(
        "/pub/game/message",
        {},
        JSON.stringify({ roomId: roomId, message: "", sender: "" , type: "EXIT"})
      );
    }
  }, []);

  function sendCall() {
    //call die raise allin
    console.log("보내기 눌렀다.--------");
    var content = "";
    var nickname = "";
    stomp.send(
      "/pub/game/message",
      {},
      JSON.stringify({ roomId: roomId, message: content, sender: nickname })
    );
  }

  function startGame() {
    //서버에서 isHost 체크
    console.log("게임 시작 누름");

    stomp.send(
      "/pub/game/message",
      {},
      JSON.stringify({ roomId: roomId, message: "", sender: "", type: "START" })
    );
  }


  //클라이언트 webrtc socket on:
  //클라이언트 game socket emit : bet, call, raise, die , 나가기, 참가,
  //클라이언트 game socket on : 내 카드 받기, 공통카드 받기, 차례 받기,
  //클라이언트 api 요청:
  //새로고침시 로비로
  //주기적으로 동기화

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>
          <ArrowForwardIosRoundedIcon className={styles.icon} />
          게임방 이름
        </h1>
        <h2>기본 베팅 10 루비</h2>
        <div className={styles.buttonList}>
          <button className={styles.button}>관전자모드</button>
          <button className={styles.button}>나가기</button>
        </div>
      </div>

      <div className={styles.grid}>
        <div className={styles.cards}>
          <div>질문영역</div>
          <div>카드영역</div>
        </div>
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
        </div>
        <div className={styles.bottoms}>
          <div>
            {/* <button>다이</button>
                        <button>콜</button>
                        <button>레이즈</button>
                        <button>올인</button> */}
          </div>
        </div>

        <div className={styles.rules}>
          트리플 &#62; 스트레이트 &#62; 더블 <br />
          에메랄드 &#62; 다이아몬드 &#62; 아쿠아마린 &#62; 자수정
        </div>
      </div>
    </div>
  );
}
