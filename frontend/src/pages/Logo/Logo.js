import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Paper from "@mui/material/Paper";
// import axios from "axios";
import styles from "./Logo.module.css";
import Login from '../../pages/Login/Login';
import Signup from '../../pages/Signup/Signup';
import Lobby from '../../pages/Lobby/Lobby';

export default function First(props) {
  useEffect(() => {}, []);

  let header = (
    <div className={styles.mainframe}>
        <p className={styles.title}>Ford Kacar</p>
        <Link to="/login"><button className={styles.button}>로그인</button></Link><br/>
        <Link to="/signup"><button className={styles.button}>회원가입</button></Link><br/>
        <Link to="/lobby"><button className={styles.button}>로비 바로가기</button></Link>
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
        </Routes>
      </BrowserRouter>
    </div>
  );

}

