import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Paper from "@mui/material/Paper";
// import axios from "axios";
import styles from "./Logo.module.css";
import Login from '../../pages/Login/Login';
import Signup from '../../pages/Signup/Signup';
import Lobby from '../../pages/Lobby/Lobby'
import Room from '../../pages/Game/Game';
import title from "../../images/logo_center.png";
import betting from "../../images/logo_betting.png";
import kakaologin from "../../images/kakao_login.png" 
import royal from "../../images/logo_royal.png";
import {KAKAO_AUTH_URL} from '../../pages/Login/OAuth';
import { Button, Switch } from "@material-ui/core";

export default function First(props) {
  useEffect(() => {}, []);


  let header = (
    <div className={styles.bg}>
      <div className={styles.mainframe}>
      <div className={styles.explan}>WebRTC 기반 심리 카드게임</div>
      <div className={styles.parent}>
        <div className={styles.child_betting}><img src={betting}/></div>
        <div className={styles.child_royal}><img src={royal}/></div>
        </div>
          <Link to="/login"><button className={styles.button}>로그인</button></Link><br/>
          <Button href={KAKAO_AUTH_URL}><img src={kakaologin}/></Button><br></br>
          <Link to="/signup"><button className={styles.button}>회원가입</button></Link><br/>
          {/* <Link to="/lobby"><button className={styles.button}>로비 바로가기</button></Link> */}
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
          <Route path="/room" element={<Room />}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );

}

