import { useState } from "react";
// import { useUserContext } from "./user-context";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import InputWithLabel from "../../components/Logincomp/InputWithLabel";

export default function Login() {
  // const { setUser } = useUserContext();

   const navigate = useNavigate();

  const [account, setAccount] = useState({
    id: "",
    password: "",
  });

  const fetchLogin = async ({ id, password }) => {
    const response = await fetch("/api/v1/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: "ssafy",
        password: "ssafy",
      }),
    });

    if (response.ok) {
      const users = await response.json();

      // const user = users.find((user) => user.id === id);
      // if (!user || user.password !== password) {
      //   throw new Error("아이디 또는 비밀번호가 일치하지 않습니다.");
      // }

      return users;
    }

    throw new Error("서버 통신이 원할하지 않습니다.");
  };

  const onSubmitAccount = async () => {
    try {
      //로그인 성공시
      const user = await fetchLogin(account);
      console.log(JSON.stringify(user.accessToken));

      //localstorage에 토큰 저장
      window.localStorage.setItem("loginToken",user.accessToken)

      //로비/rooms 로 이동
      navigate("/lobby/rooms")

    } catch (error) {
      //로그인 실패
      window.alert(error);
    }
  };

  return (
    <div>
      <h1><Link to="/login">로그인</Link></h1>
      ID <InputWithLabel id="id" name="id" placeholder="아이디 입력" /><br/>
      비밀번호 <InputWithLabel
        id="password"
        name="password"
        type="password"
        placeholder="비밀번호 입력"
      /><br/>
      <button onClick={onSubmitAccount}>로그인</button><br/>
      <Link to="/">뒤로가기</Link>
    </div>
  );
}
