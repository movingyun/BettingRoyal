import * as React from "react";
import Player from "./Player";
import { useEffect, useState } from "react";
import styles from "./Game.module.css";
import ArrowForwardIosRoundedIcon from "@mui/icons-material/ArrowForwardIosRounded";
// import sockjs from "sockjs-client";
// import stompjs from "stompjs";
// import axios from "axios";

export default function Game(props) {
  const [players, setPlayers] = useState([]);

  let roomid = //axios get roomid

  useEffect(() => {
    // var sock = new sockjs("http://localhost:8080");
    // let stomp = stompjs.over(sock)
    // stomp.connect({}, () => {
    //   stomp.subscribe("/game/"+roomid, (data) => {
    //     const playersData = JSON.parse(data.body);
    //     setPlayers(playersData);
    //   });
    // });
  }, []);

  //클라이언트 webrtc socket on:
  //클라이언트 game socket emit : bet, call, raise, die , 나가기, 참가,
  //클라이언트 game socket on : 내 카드 받기, 공통카드 받기, 차례 받기,
  //클라이언트 api 요청:

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
