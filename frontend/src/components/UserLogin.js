import  { useState } from "react";
// import { useUserContext } from "./user-context";
import {  Link } from "react-router-dom";

export default function UserLogin() {
  // const { setUser } = useUserContext();

  //  const navigate = useNavigate();

  const [account, setAccount] = useState({
    id: "",
    password: "",
  });

  const fetchLogin = async ({ id, password }) => {
    const response = await fetch("http://localhost:8888/users");
  
    if (response.ok) {
      const users = await response.json();
  
      const user = users.find((user) => user.id === id);
      if (!user || user.password !== password) {
        throw new Error("아이디 또는 비밀번호가 일치하지 않습니다.");
      }
  
      return user;
    }

    throw new Error("서버 통신이 원할하지 않습니다.");
};


  const onSubmitAccount = async () => {
    try {
      const user = await fetchLogin(account);

      // setUser(user);
      console.log(user);

      // navigate("/");
    } catch (error) {
      window.alert(error);
    }
  };

  
  return (
    <div>
      <Link to="/">뒤로가기</Link>
      <input
        id="id"
        name="id"
        placeholder="아이디 입력"
      />
      <input
        id="password"
        name="password"
        type="password"
        placeholder="비밀번호 입력"
      />
      <button onClick={onSubmitAccount}>로그인</button>
    </div>
  );
}
