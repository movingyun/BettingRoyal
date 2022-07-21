import { useEffect, useState } from "react";
import axios from "axios";
import styles from "./LoginMain.module.css";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import UserLogin from "./UserLogin";


export default function LoginMain(props) {
  useEffect(() => {}, []);

  const [login, setLogin] = useState(false);
  const [signup, setSignup] = useState(false);

  function loginClick() {
    setLogin(true);
    setSignup(false);
  }
  function signupClick() {
    setLogin(false);
    setSignup(true);
  }

  let loginmain = (
    <div className="mainframe">
      <p className="title">멘탈리스트</p>

      <Link to="/login">로그인</Link>

      <Link to="/signup">회원가입</Link>
    </div>
  );

  let loginpage = <Link to="/">뒤로가기</Link>;

  let signuppage = <Link to="/">뒤로가기</Link>;
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={loginmain}></Route>
          <Route path="/login" element={<UserLogin />}></Route>
          <Route path="/signup" element={signuppage}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}
