import { useEffect, useState } from "react";
import Player from "./Player";
import axios from "axios";
import styles from "./Gameroom.module.css";
import sockjs from "sockjs-client";
import stompjs from "stompjs";

export default function Gameroom(props) {
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
    <div>
      <div className={styles.Player1}>
        <Player player={players[0]} />
      </div>
      <div className={styles.Player2}>
        <Player player={players[1]} />
      </div>{" "}
      <div className={styles.Player3}>
        <Player player={players[2]} />
      </div>
      <div className={styles.Player4}>
        <Player player={players[3]} />
      </div>{" "}
      <div className={styles.Player5}>
        <Player player={players[4]} />{" "}
      </div>
      <div className={styles.Player6}>
        <Player player={players[5]} />
      </div>
    </div>
  );
}
