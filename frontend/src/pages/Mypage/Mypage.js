import React from "react";
import styles from "./Mypage.module.css";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "bootstrap";
import Modal from "../../components/Modal/Modal";
import Vault from "../../pages/modal/Vault/Vault";
import Nickname from "../../pages/modal/Nickname/Nickname";
import MyInfoDelete from "../../pages/modal/MyInfoDelete/MyInfoDelete";
import Password from "../modal/Password/Password";
import ArrowForwardIosRoundedIcon from "@mui/icons-material/ArrowForwardIosRounded";
import { Box, ListItem, ListItemText } from "@mui/material";
import { style } from "@mui/system";

const Mypage = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalOpen1, setModalOpen1] = useState(false);
  const [modalOpen2, setModalOpen2] = useState(false);
  const [modalOpen3, setModalOpen3] = useState(false);
  const [nickname, setNickname] = useState();
  const [email, setEmail] = useState();
  const [gender, setGender] = useState();
  const [ruby, setRuby] = useState(0);
  const [gameCnt, setGameCnt] = useState(0);
  const [gameWin, setGameWin] = useState(0);
  const [startDate, setStartDate] = useState();
  const [changeNickname, setChangeNickname] = useState();
  const [changePw, setChangePw] = useState();
  const [myBadge, setMyBadge] = useState([]);

  const [open, setOpen] = useState(true);
  const [open1, setOpen1] = useState(true);
  const [open2, setOpen2] = useState(true);
  const [open3, setOpen3] = useState(true);

  const toggleDrawer = () => {
    setOpen(!open);
  };
  const toggleDrawer1 = () => {
    setOpen1(!open1);
  };
  const toggleDrawer2 = () => {
    setOpen2(!open2);
  };
  const toggleDrawer3 = () => {
    setOpen3(!open3);
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
  const openModal3 = () => {
    setModalOpen3(true);
  };
  const closeModal3 = () => {
    setModalOpen3(false);
  };

  useEffect(() => {
    axios
      .get("/api/user", {
        headers: {
          Authorization: window.localStorage.accessToken,
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        console.log(JSON.stringify(response.data.userEmail));
        setNickname(response.data.userNickname);
        setEmail(response.data.userEmail);
        setGender(response.data.userGender);
        setGameCnt(response.data.userGameCount);
        setGameWin(response.data.userWin);
        setStartDate(response.data.userRecent);
        setRuby(response.data.userRuby);
      });

    initBadge();
  }, []);

  async function initBadge() {
    await axios
      .post("/api/badgeown", null, {
        headers: {
          Authorization: window.localStorage.accessToken,
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.log(error);
      });

    await axios
      .get("/api/badgeown", {
        headers: {
          Authorization: window.localStorage.accessToken,
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        console.log(response);
        setMyBadge(response.data);
      });
  }

  async function changeMyBadge(badgeId) {
    await axios
      .put("/api/badgeown", null, {
        params: { badgeId: badgeId },
        headers: {
          Authorization: window.localStorage.accessToken,
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.log(error);
      });

    await axios
      .get("/api/badgeown", {
        headers: {
          Authorization: window.localStorage.accessToken,
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        console.log(response);
        setMyBadge(response.data);
      });
  }
  // const dateSubstr = {startDate}.substr(0,9);

  return (
    <div>
      <div className={styles.section}>
        <h3 className={styles.title}>
          <ArrowForwardIosRoundedIcon sx={{ fontSize: 20, mr: 0.5, mb: 0.4 }} />내 정보
        </h3>
        <hr />
        <div>닉네임 : {nickname}</div>
        <div>이메일 : {email}</div>
        <div>성별 : {gender}</div>
        <div>보유 루비 : {ruby.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} 루비</div>
        <div className={styles.btnList}>
          <button onClick={openModal} className={styles.btn}>
            금고
          </button>
          <Modal open={modalOpen} close={closeModal} header="루비금고">
            <Vault />
          </Modal>
          <button onClick={openModal1} className={styles.btn}>
            닉네임 변경
          </button>
          <Modal open={modalOpen1} close={closeModal1} header="닉네임 변경">
            <Nickname />
          </Modal>
          <button onClick={openModal3} className={styles.btn}>
            회원탈퇴
          </button>
          <Modal open={modalOpen3} close={closeModal3} header="회원 탈퇴">
            <MyInfoDelete />
          </Modal>
        </div>
      </div>
      <div className={styles.section}>
        <h3 className={styles.title}>
          <ArrowForwardIosRoundedIcon sx={{ fontSize: 20, mr: 0.5, mb: 0.4 }} />
          배지
        </h3>
        <hr />
        <Box sx={{ display: "flex" }}>
          {myBadge.map((item, index) => (
            <Box
              sx={{ mr: "15px" }}
              className={item.badgeOwnIsUsing ? styles.myUsingBadge : styles.myUnUsingBadge}
            >
              <img
                src={"/images/badge/" + item.badge.badgeImg}
                height="100"
                width="100"
                className={styles.imgBadge}
                onClick={() => {
                  changeMyBadge(item.badge.badgeId);
                  console.log(item.badge);
                }}
              />
            </Box>
          ))}
        </Box>
      </div>
      <div className={styles.sectionBottom}>
        <h3 className={styles.title}>
          <ArrowForwardIosRoundedIcon sx={{ fontSize: 20, mr: 0.5, mb: 0.4 }} />
          통계
        </h3>
        <hr />
        <div>
          전적 : {gameCnt} 전 {gameWin} 승 {gameCnt - gameWin} 패
        </div>
        <div>승률 : {`${((gameWin / gameCnt) * 100).toFixed(2)}`} %</div>
        <div>가입일 : {startDate}</div>
      </div>
    </div>
  );
};

export default Mypage;
