import { useState } from "react";
import styles from './Player.module.css'

export default function Player(props) {
  const [player, setPlayer] = useState(props.player);

  return (
    <div>
      {player ? (
        <div className={styles.Player}>
          <div class="face">{player.face}</div>
          <div class="name">{player.name}</div>
          <div class="ruby">{player.ruby}</div>
          <div class="card">{player.card}</div>
          <div class="match">{player.match}</div>
          <div class="status">{player.status}</div>
        </div>
      ) : (
        <div>
          <div class="empty"> + </div>
        </div>
      )}
    </div>
  );
}
