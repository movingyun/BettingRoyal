import { useEffect, useState } from "react";
import axios from "axios";
import styles from "./Header.module.css";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Login from "./login/Login";
import SignUpPage from "./login/SignUpPage"
import Lobby from "./Lobby";
import Paper from "@mui/material/Paper";

export default function Header(props) {
  useEffect(() => {}, []);

  let header = (
    <div className={styles.mainframe}>
      <Paper className={styles.loginmenu} elevation={3}>
        <p className="title">멘탈리스트</p>

        <div>
          <Link to="/login">로그인</Link>
        </div>
        <div>
          <Link to="/signup">회원가입</Link>
        </div>
      </Paper>
    </div>
  );

  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={header}></Route>
          <Route path="/login" element={<Login />}></Route>
          <Route path="/signup" element={<SignUpPage/>}></Route>
          <Route path="/lobby/*" element={<Lobby />}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}
