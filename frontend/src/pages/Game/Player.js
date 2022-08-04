import { Divider } from "@material-ui/core";
import { useState, useEffect } from "react";
import styles from "./Player.module.css";
import card_back from "../../images/cards/card_back.png";
import card_am_1 from "../../images/cards/card_am_1.png";
import UserVideoComponent from '../../components/Openvidu/UserVideoComponent';

import Gameroom from './Gameroom'


export default function Player(props) {
  const [player, setPlayer] = useState(props.player);

  console.log(props.state)
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
        <div className={styles.player}>
          <div className={styles.list}>
            <div className={styles.camera}>
              {/* 여기에 Video Compoenent를 하자 */}

              {this.state.session !== undefined ? (
                <div id="me" className="stream-container col-md-6 col-xs-6" onClick={() => props.handleMainVideoStream(props.state.publisher)}>
                    <UserVideoComponent
                        streamManager />
                </div>
                ) : null}
              {/* <p>{props.state}</p> */}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}