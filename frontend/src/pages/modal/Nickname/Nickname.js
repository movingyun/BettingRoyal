import React from "react";
import axios from "axios";
import { useEffect, useState } from "react";
import { TextField } from "@material-ui/core";
import styles from "./Nickname.module.css";

export default function Nickname() {

  const [nicknameStatus, setNicknameStatus] = useState("");
  const [nickname, setNickname] = useState();
  const [changeNickname, setChangeNickname] = useState();
  

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
        setNickname(response.data.userNickname);

      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  function ModifyNickname() {
    console.log("확인", nickname)
    axios
      .put("/api/user/modify2", {modifyNickname:changeNickname}, {
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          Authorization: window.localStorage.accessToken,
        },
      })
      .then((response) => {
        console.log("Change Nickname : " + JSON.stringify(response.data.userNickname));
        setChangeNickname(response.data.userNickname);
        setNicknameStatus(changeNickname + "닉네임 변경 완료");
      })
      .catch((error) => {
        if(error.response.data.error == 10) {
          setNicknameStatus('닉네임을 입력하세요.')
        }
      });
  }

  return (
    <div>
      <p className={styles.bg}>닉네임 : {nickname}</p>
      <div className={styles.contents}>
      <TextField
        className={styles.field}
        onChange={(e) => {
          setChangeNickname(e.target.value);
        }}
        autoFocus
        placeholder="새로운 닉네임을 입력하세요."
      ></TextField>
      <button onClick={ModifyNickname} className={styles.btn}>변경</button>
      <p className={styles.read}>{nicknameStatus}</p>
      </div>
    </div>
  );
}
