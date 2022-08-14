import React from 'react';
import styles from "./Mypage.module.css";
import axios from "axios";
import {useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from 'bootstrap';
import Modal from '../../components/Modal/Modal';
import Vault from '../../pages/modal/Vault/Vault';
import Nickname from '../../pages/modal/Nickname/Nickname';
import ArrowForwardIosRoundedIcon from '@mui/icons-material/ArrowForwardIosRounded';

const Mypage = () => {
    const [modalOpen, setModalOpen] = useState(false);
    const [modalOpen1, setModalOpen1] = useState(false);
    const [modalOpen2, setModalOpen2] = useState(false);
    const [nickname, setNickname] = useState();
    const [email, setEmail] = useState();
    const [gender, setGender] = useState();
    const [ruby, setRuby] = useState();
    const [gameCnt, setGameCnt] = useState(0);
    const [gameWin, setGameWin] = useState(0);
    const [startDate, setStartDate] = useState();
    const [changeNickname, setChangeNickname] = useState();
    const [changePw, setChangePw] = useState();

    const [open, setOpen] = useState(true);
    const [open1, setOpen1] = useState(true);
    const [open2, setOpen2] = useState(true);

    const toggleDrawer = () => {
      setOpen(!open);
    };
    const toggleDrawer1 = () => {
      setOpen1(!open1);
    };
    const toggleDrawer2 = () => {
        setOpen2(!open2);
      };

    const openModal = () => {
        setModalOpen(true);
    };
    const closeModal = () => {
        setModalOpen(false);
    };
    const openModal1 = () => {
        setModalOpen1(true);
    };
    const closeModal1 = () => {
        setModalOpen1(false);
    };
    const openModal2 = () => {
        setModalOpen2(true);
    };
    const closeModal2 = () => {
        setModalOpen2(false);
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
            setRuby(response.data.userRuby);
        });
    },[]); 

    // function changeNickname() {
    //     console.log("닉네임 변경", )
    // }

    // const dateSubstr = {startDate}.substr(0,9);
    const navigate = useNavigate();

    function logout(){
        window.localStorage.removeItem("accessToken");
        alert("로그아웃 되었습니다.")
        navigate("/");
    }

    return (
        <div>
            <div className={styles.section}>
                <h3 className={styles.title}><ArrowForwardIosRoundedIcon sx={{ fontSize:20 }}/> 내 정보</h3>
                <hr />
                <div>닉네임 : {nickname}</div>
                <div>이메일 : {email}</div>
                <div>성별 : {gender}</div>
                <div>보유 루비 : {ruby} 루비</div>
                <div className={styles.btnList}>
                <button onClick={ openModal } className={styles.btn}>금고</button>
                <Modal open={ modalOpen } close={ closeModal } header="루비금고">
                <Vault />
                </Modal>
                <button onClick={ openModal1 } className={styles.btn} >닉네임 변경</button>
                <Modal open={ modalOpen1 } close={ closeModal1 } header="닉네임 변경">
                    <Nickname />
                </Modal>
                <button onClick={ openModal2 }className={styles.btn}  >비밀번호 변경</button>
                <Modal open={ modalOpen2 } close={ closeModal2 } header="닉네임 변경">
                </Modal>
                <button onClick={ logout } >로그아웃 (위치 변경해야 함)</button>
                </div>
            </div>
            <div className={styles.section}>
                <h3 className={styles.title}><ArrowForwardIosRoundedIcon sx={{ fontSize:20 }}/> 배지</h3>
                <hr/>
                <div>없뚬</div>
            </div>
            <div className={styles.sectionBottom}>
                <h3 className={styles.title}><ArrowForwardIosRoundedIcon sx={{ fontSize:20 }}/> 통계</h3>
                <hr/>
                <div>전적 : {gameCnt} 전 {gameWin} 승 {gameCnt-gameWin} 패</div>
                <div>승률 : {`${(gameWin/gameCnt*100).toFixed(2)}`} %</div>
                <div>가입일 : {startDate}</div>
            </div>
        </div>
    )
}

export default Mypage