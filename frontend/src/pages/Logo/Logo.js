import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Paper from "@mui/material/Paper";
// import axios from "axios";
import styles from "./Logo.module.css";
import Login from '../../pages/Login/Login';
import Signup from '../../pages/Signup/Signup';
import Lobby from '../../pages/Lobby/Lobby'
import Game from '../../pages/Game/Game';
import title from "../../images/logo_center.png";
import betting from "../../images/logo_betting.png";
import royal from "../../images/logo_royal.png";

import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';

const useAudio = url => {
  const [audio] = useState(new Audio(url));
  const [playing, setPlaying] = useState(false);

  const toggle = () => {
    setPlaying(!playing);
  }

  const playingBGM = () => {
    setPlaying(true);
  }

  useEffect(() => {
    // audio.muted = true
    // audio.muted = false
    audio.volume = 0.1;
    playing ? audio.play() : audio.pause();
    audio.loop = true
  },[playing]);

  useEffect(() => {
    audio.addEventListener('ended', () => setPlaying(false));
    return () => {
      audio.removeEventListener('ended', () => setPlaying(false));
    };
  }, []);

  return [playing, toggle, playingBGM];
};

export default function First(props) {
  const [playing, toggle, playingBGM] = useAudio('./Audio/BGM.mp3');

  let header = (
    <div className={styles.bg}>
      <div className={styles.mainframe}>
        <div className={styles.explan}>WebRTC 기반 심리 카드게임</div>
        <div className={styles.parent}>
          <div className={styles.child_betting}><img src={betting}/></div>
          <div className={styles.child_royal}><img src={royal}/></div>
        </div>
        <Link to="/login"><button onClick={playingBGM} className={styles.button}>로그인</button></Link><br/>
        <Link to="/signup"><button onClick={playingBGM} className={styles.button}>회원가입</button></Link><br/>
        <Link to="/lobby" toggle={toggle} playing={playing}><button onClick={playingBGM} className={styles.button}>로비 바로가기</button></Link>
        <button className={styles.BGMbutton} onClick={toggle}>{playing ? <VolumeUpIcon/> : <VolumeOffIcon/>}</button>
      </div>
    </div>
    
  );

  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={header}></Route>
          <Route path="/login" element={<Login />}></Route>
          <Route path="/signup" element={<Signup/>}></Route>
          <Route path="/lobby/*" element={<Lobby />}></Route>
          <Route path="/game" element={<Game />}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );

}

