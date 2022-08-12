import React from 'react';
import styles from "./Mypage.module.css";
import axios from "axios";
import {useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from 'bootstrap';

const Mypage = () => {
    const [modalOpen, setModalOpen] = useState(false);
    const [nickname, setNickname] = useState();
    const [email, setEmail] = useState();
    const [gender, setGender] = useState();
    const [gameCnt, setGameCnt] = useState(0);
    const [gameWin, setGameWin] = useState();
    const [startDate, setStartDate] = useState();
    const [changeNickname, setChangeNickname] = useState();
    const [changePw, setChangePw] = useState();

    const [open, setOpen] = useState(true);
    const toggleDrawer = () => {
      setOpen(!open);
    };

    const openModal = () => {
        setModalOpen(true);
    };
    const closeModal = () => {
        setModalOpen(false);
    };

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
            setGameCnt(response.data.userGameCount);
            setGameWin(response.data.userWin);
            setStartDate(response.data.userRecent);
        });
    },[]); 

    // function changeNickname() {
    //     console.log("닉네임 변경", )
    // }

    const navigate = useNavigate();

    function logout(){
        window.localStorage.removeItem("accessToken");
        alert("로그아웃 되었습니다.")
        navigate("/");
    }

    return (
        <div>
            <div>
            <div>
                <div>닉네임 : {nickname}</div>
                <div>이메일 : {email}</div>
                <div>성별 : {gender}</div>
            </div>
            <button onClick={ openModal } >금고</button><br/>
            
            <button>닉네임 변경</button><br/>
            <button>비밀번호 변경</button><br/>
            <button onClick={ logout }  >로그아웃</button>
            </div>
            <div>
                <br/>
                <h3>배지</h3>
                배지정보
                <div>없뚬 </div>
            </div>
            <div>
                <br/>
                <h3>통계</h3>
                <div>총게임 횟수 : {gameCnt}</div>
                <div>이긴게임 횟수 : {gameWin}</div>
                <br/>
                승률정보
                <div>승률 : { {gameCnt}===0 ? <div>0</div> : {gameWin}/{gameCnt} }</div>
            </div>
            <div>
                <br></br>
                <h3>Betting Royal과 함께한 시작일자</h3>
                <div>{startDate}</div>
            </div>
        </div>
    )
}

export default Mypage