import { useState, useEffect } from "react";
import styles from "./Player.module.css";

export default function Player(props) {
  const [player, setPlayer] = useState(props.player);
  //console.log(props.player);
  useEffect(() => {
    // axios.get("http://").then((playersdata) => {
    //   setPlayers(playersdata);
    // });
    //console.log(player)
    //console.log(props.player)
  }, []);

  useEffect(() => {
    // axios.get("http://").then((playersdata) => {
    //   setPlayers(playersdata);
    // });
    setPlayer(props.player)
  }, [props.player]);

  return (
    <div>
      {player ? (
        <div className={styles.Player}>
          <div className="face">{player.face}</div>
          <div className="name">{player.name}</div>
          <div className="ruby">{player.ruby}</div>
          <div className="card">{player.card}</div>
          <div className="match">{player.match}</div>
          <div className="status">{player.status}</div>
        </div>
      ) : (
        <div>
          <div class="empty"> + </div>
        </div>
      )}
    </div>
  );
}
