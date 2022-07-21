import { useEffect, useState } from "react";
import axios from "axios";
import styles from "./LoginMain.module.css";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import UserLogin from "./UserLogin";
import Lobby from "./Lobby";

export default function LoginMain(props) {
  useEffect(() => {}, []);


  let loginmain = (
    <div className="mainframe">
      <p className="title">멘탈리스트</p>

      <Link to="/login">로그인</Link>

      <Link to="/signup">회원가입</Link>
    </div>
  );

  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={loginmain}></Route>
          <Route path="/login" element={<UserLogin />}></Route>
          <Route path="/signup" ></Route>
          <Route path="/lobby/*" element={<Lobby/>} ></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}
