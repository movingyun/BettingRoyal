import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Paper from "@mui/material/Paper";
// import axios from "axios";
import styles from "./Logo.module.css";
import Login from "../../pages/Login/Login";
import Signup from "../../pages/Signup/Signup";
import Lobby from "../../pages/Lobby/Lobby";
import Room from "../../pages/Game/Game";
import betting from "../../images/logo/logo_betting.png";
import kakaologin from "../../images/kakao_login.png";
import royal from "../../images/logo/logo_royal.png";
import { KAKAO_AUTH_URL } from "../../pages/Login/OAuth";
import { Button, Switch } from "@material-ui/core";
import LobbyApp from "../Lobby/LobbyApp";

import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import VolumeOffIcon from "@mui/icons-material/VolumeOff";

import TEST from "../../components/Audio/Test";

const useAudio = (url) => {
  const [audio] = useState(new Audio(url));
  const [playing, setPlaying] = useState(false);

  const toggle = () => {
    setPlaying(!playing);
  };

  const playingBGM = () => {
    setPlaying(true);
  };

  useEffect(() => {
    // audio.muted = true
    // audio.muted = false
    audio.volume = 0.5;
    playing ? audio.play() : audio.pause();
    audio.loop = true;
  }, [playing]);

  useEffect(() => {
    audio.addEventListener("ended", () => setPlaying(false));
    return () => {
      audio.removeEventListener("ended", () => setPlaying(false));
    };
  }, []);

  return [playing, toggle, playingBGM, setPlaying];
};

export default function First(props) {
  const [playing, toggle, playingBGM, setPlaying] = useAudio("./Audio/BGM.mp3");

  function bgmState() {
    toggle();
  }

  let header = (
    <div className={styles.bg}>
      <div className={styles.mainframe}>
        <div className={styles.explan}>온라인 화상 심리 카드게임 서비스</div>
        <div className={styles.parent}>
          <div className={styles.child_betting}>
            <img src={betting} />
          </div>
          <div className={styles.child_royal}>
            <img src={royal} />
          </div>
        </div>
        <Link to="/login">
          <button className={styles.button} onClick={playingBGM} >로그인</button>
        </Link>
        <br />
        {/* <Button href={KAKAO_AUTH_URL}><img src={kakaologin}/></Button><br></br> */}
        <Link to="/signup">
          <button className={styles.button} onClick={playingBGM} >회원가입</button>
        </Link>
        <br />
        {/* <Link to="/lobby"><button className={styles.button}>로비 바로가기</button></Link> */}
        <button className={styles.BGMbutton} onClick={toggle}>
          {playing ? <VolumeUpIcon /> : <VolumeOffIcon />}
        </button>
      </div>
    </div>
  );

  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={header}></Route>
          <Route path="/login" element={<Login />}></Route>
          <Route path="/signup" element={<Signup />}></Route>
          <Route path="/lobby/*" element={<Lobby bgmState={bgmState} playing={playing} />}></Route>
          <Route path="/room" element={<Room />}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}
