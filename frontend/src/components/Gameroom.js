import { useEffect, useState } from "react";
import Player from "./Player";
import axios from "axios";

export default function Gameroom() {
  const [players, setPlayers] = useState([]);

  //useeffect에 빈 배열 넣으면 컴포넌트 생성 시에만 실행됨.
  useEffect(() => {
    axios.get("http://").then((playersdata) => {
      setPlayers(playersdata);
    });
  }, []);

  function getPlayersInfo(playersInfo) {
    //방 시작 시, ajax 로 모든 플레이어 정보 받아옴
    setPlayers(playersInfo);
  }

  return (
    <div>
      <Player player={players[0]} />
      <Player player={players[1]} />
      <Player player={players[2]} />
      <Player player={players[3]} />
      <Player player={players[4]} />
      <Player player={players[5]} />
    </div>
  );
}
