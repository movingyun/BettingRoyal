import React from "react";
import axios from "axios";
import { useEffect, useState } from "react";
import { TextField } from "@material-ui/core";
import styles from "./Password.module.css";

export default function Password() {

  const [passwordStatus, setPasswordStatus] = useState("");
  const [password, setPassword] = useState();
  const [changePassword, setChangePassword] = useState();
  

  useEffect(() => {
    axios
    .get("/api/user", { 
        headers: {
          Authorization: window.localStorage.accessToken,
          "Content-Type": "application/json",

        },
      })
      .then((response) => {
        console.log("user Nickname = " + JSON.stringify(response.data.userNickname));
        setPassword(response.data.userPassword);

      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  function ModifyPassword() {
    console.log("확인", password)
    axios
      .put("/api/user/modify", {userPw:changePassword}, {
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          Authorization: window.localStorage.accessToken,
        },
      })
      .then((response) => {
        console.log("Change Nickname : " + JSON.stringify(response.data.userNickname));
        setChangePassword(response.data.userPw);
        setPasswordStatus(changePassword + "닉네임 변경 완료");
      })
      .catch((error) => {
        if(error.response.data.error == 10) {
          setPasswordStatus('닉네임을 입력하세요.')
        }
      });
  }

  return (
    <div>
      <p className={styles.bg}>비번</p>

      <TextField
        onChange={(e) => {
          setChangePassword(e.target.value);
        }}
        autoFocus
      ></TextField>
      <button onClick={ModifyPassword}>변경</button>
      <p className={styles.read}>{passwordStatus}</p>
      
    </div>
  );
}
