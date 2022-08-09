import { Divider } from "@material-ui/core";
import { useState, useEffect } from "react";
import styles from "./Player.module.css";
import card_back from "../../images/cards/card_back.png";
import card_am_1 from "../../images/cards/card_am_1.png";
import UserVideoComponent from '../../components/Openvidu/UserVideoComponent';



export default function Player(props) {
  const [player, setPlayer] = useState(props.player);

  useEffect(() => {
    console.log(props.player);
    // axios.get("http://").then((playersdata) => {
    //   setPlayers(playersdata);
    // });
    setPlayer(props.player);
  }, [props.player]);

  return (
    <div className={styles.container}>
      {player ? (
        <div className={styles.player}>
          <div className={styles.list}>
            <div className={styles.camera}></div>
            <div className={styles.info}>
              <div className={styles.userInfo}>
                <div className={styles.name}>{player.sessionId}</div>
                <div className={styles.ruby}>{player.myRuby}</div>
              </div>
              {/* <hr className={styles.divider}/> */}
              <div className={styles.gameInfo}>
                <div className={styles.card}>
                  {/* 카드뒷면 */}
                  <div className={styles.card_back}>
                    <img src={card_back} />
                  </div>
                  {/* 카드앞면오픈 */}
                  <div className={styles.card_front}>
                    <img src={card_am_1} />
                  </div>
                </div>
                <div className={styles.status}>더블</div>
                <div className={styles.emotion}>감정상태</div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        // 플레이어 안들어옴
        // <div className={styles.player}>
        //   <div className={styles.empty}> + </div>
        // </div>

        // 플레이어 들어왔을 때 테스트
        <div className={styles.player}>
          <div className={styles.list}>

            <div className={styles.camera}>
              {props.streamManager !== undefined ? (
                <div id="me" className="stream-container col-md-6 col-xs-6" onClick={() => props.handleMainVideoStream(props.streamManager)}>
                    <UserVideoComponent
                        streamManager={props.streamManager} />
                </div>
                ) : null}
            </div>
            <div className={styles.info}>
              <div className={styles.userInfo}>
                  <div className={styles.name}>닉네임</div>
                  <div className={styles.ruby}>100,000 루비</div>
              </div>
              {/* <hr className={styles.divider}/> */}
              <div className={styles.gameInfo}>
                <div className={styles.card}>
                  {/* 카드뒷면 */}
                  <div className={styles.card_back}>
                    <img src={card_back} />
                  </div>
                  {/* 카드앞면오픈 */}
                  <div className={styles.card_front}>
                    <img src={card_am_1} />
                  </div>
                </div>
                <div className={styles.status}>더블</div>
                <div className={styles.emotion}>감정상태</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
