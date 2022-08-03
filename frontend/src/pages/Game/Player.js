import { Divider } from "@material-ui/core";
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
    <div className={styles.container}>
      {player ? (
        <div className={styles.player}>
          <div className="face">{player.face}</div>
          <div className="name">{player.name}</div>
          <div className="ruby">{player.ruby}</div>
          <div className="card">{player.card}</div>
          <div className="match">{player.match}</div>
          <div className="status">{player.status}</div>
        </div>
      ) : (
        // 플레이어 안들어옴
        // <div className={styles.player}>
        //   <div className={styles.empty}> + </div>
        // </div>

        // 플레이어 들어왔을 때 테스트
        <div className={styles.player}>
          <div className={styles.list}>
            <div className={styles.camera}>카메라</div>
            <div className={styles.info}>
              <div className={styles.userInfo}>
                  <div className={styles.name}>닉네임</div>
                  <div className={styles.ruby}>100,000 루비</div>
              </div>
              <hr className={styles.divider}/>
              <div className={styles.gameInfo}>
                <div className={styles.card}>카드</div>
                <div className={styles.status}>
                  상태
                    {/* <div className={styles.pair}>원페어</div>
                    <div className={styles.emotion}>감정상태</div> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
