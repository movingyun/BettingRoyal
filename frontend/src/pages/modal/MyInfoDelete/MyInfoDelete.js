import React from "react";
import axios from "axios";
import { useEffect, useState } from "react";
import { TextField } from "@material-ui/core";
import styles from "./MyInfoDelete.module.css";
import { useNavigate  } from "react-router-dom";

export default function Nickname() {

  const [nicknameStatus, setNicknameStatus] = useState("");
  const [nickname, setNickname] = useState();
  const [changeNickname, setChangeNickname] = useState();
  const [userId, setUserId] = useState();
  

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
        setUserId(response.data.userId);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  let navigate = useNavigate();

  function myInfoDelete() {
    console.log("탈퇴"+ userId);
    axios
    .delete("/api/user", {
      // params: { userId: userId },
      headers: {
        Authorization: window.localStorage.accessToken,
        "Content-Type": "application/json",
      },
    })
    .then((response) => {
      console.log("test:"+response.data);
      })
      .catch((error) => {
        console.log(error);
      });
      navigate("/")
    }

  return (
    <div>
      <p className={styles.bg}>{nickname}님, 정말 회원탈퇴 하시겠습니까?</p>
      <div className={styles.contents}>
      <button onClick={myInfoDelete} className={styles.btn}>네</button>
      <p className={styles.read}>{nicknameStatus}</p>
      </div>
    </div>
  );
}
