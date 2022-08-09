import React from 'react';
import styles from "./Mypage.module.css";
import axios from "axios";
import {useEffect, useState } from "react";

const Mypage = () => {
    const [nickname, setNickname] = useState();
    const [email, setEmail] = useState();
    const [gender, setGender] = useState();
    const [changeNickname, setChangeNickname] = useState();
    const [changePw, setChangePw] = useState();

    
    useEffect(()=> {
        axios
        .get("/api/user", {
            headers : {
                Authorization: window.localStorage.accessToken,
                "Content-Type": "application/json",
            },
        })
        .then((response)=> {
            console.log(JSON.stringify(response.data.userEmail));
            setNickname(response.data.userNickname);
            setEmail(response.data.userEmail);
            setGender(response.data.userGender);

        });
    },[]); 


    return (
        <div className={styles.container}>
            <div>
            <h3>내 정보</h3>
            <div>
                <div>닉네임 : {nickname}</div>
                <div>이메일 : {email}</div>
                <div>성별 : {gender}</div>
            </div>
            <button>닉네임 변경</button><br/>
            <button>비밀번호 변경</button>
            </div>
            <div>
                <h3>배지</h3>
                배지정보
            </div>
            <div>
                <h3>통계</h3>
                승률정보
            </div>
        </div>
    )
}

export default Mypage