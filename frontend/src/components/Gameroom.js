import { useEffect, useState } from "react";
import Player from "./Player";
import axios from "axios";
import styles from "./Gameroom.module.css";
import sockjs from "sockjs-client";
import stompjs from "stompjs";


var sock = new sockjs("http://localhost:8080");
let stomp = stompjs.over(sock)

export default function Gameroom(props) {
  const [players, setPlayers] = useState([]);
  let roomid=props.roomid;
  
  //const [stomp, setStomp] = useState(); //stomp 연결을 state로 관리. 연결 끊어지면 다시 연결하기 위해.

  useEffect(() => {
    //setStomp(stompjs.over(sock));

    stomp.connect({}, () => {
      stomp.subscribe("/game/"+roomid, (data) => {
        const playersData = JSON.parse(data.body);
        setPlayers(playersData);
      });
    }); 
  }, []);

  //useeffect에 빈 배열 넣으면 컴포넌트 생성 시에만 실행됨.
  // useEffect(() => {
  //   // axios.get("http://").then((playersdata) => {
  //   //   setPlayers(playersdata);
  //   // });

  //   setPlayers([
  //     { face: "aa", name: "ssafy", ruby: 3000 },
  //     { face: "bb", name: "bb", ruby: 4000 },
  //   ]);
  // }, []);


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
