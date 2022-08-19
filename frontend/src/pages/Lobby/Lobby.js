import React from "react";
import LobbyApp from "./LobbyApp";
import { useEffect } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import Mypage from "../../pages/Mypage/Mypage";
import Friend from "../../pages/Friend/Friend";
import Ranking from "../../pages/Ranking/Ranking";
import Guild from "../../pages/Guild/Guild";
import Replay from "../../pages/Replay/Replay";
import Tutorial from "../../pages/Tutorial/Tutorial";
import { dashboardTheme } from "../../dashboardTheme";
import Rooms from "../../pages/Rooms/Rooms";
import Test from "../../pages/Test/Test";
import Board from "../Board/Board";
import Notice from "../Notice/Notice";

import styles from "../Logo/Logo.module.css";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import VolumeOffIcon from "@mui/icons-material/VolumeOff";

export default function Lobby(props) {
  // useEffect(() => {
  //   if (!localStorage.getItem("accessToken")) {
  //     console.log("로그인하세요");
  //     navigate("/login");
  //   }
  // }, []);

  function toggle() {
    props.bgmState();
    // console.log(props.playing)
  }

  const navigate = useNavigate();
  let sidemenu = (
    <ThemeProvider theme={dashboardTheme}>
      <LobbyApp bgmState={props.bgmState}/>

      {/* <Routes>
        <Route path="rooms" element={<Rooms />} />
        <Route path="mypage" element={<Mypage />} />
        <Route path="notice/*" element={<Notice />} />
        <Route path="board/*" element={<Board />} />
        <Route path="friend" element={<Friend />} />
        <Route path="ranking" element={<Ranking />} />
        <Route path="guild" element={<Guild />} />
        <Route path="replay" element={<Replay />} />
        <Route path="tutorial" element={<Tutorial />} />
        <Route path="test" element={<Test />} />
      </Routes> */}
      <button className={styles.BGMbutton} onClick={toggle}>
        {props.playing ? <VolumeUpIcon /> : <VolumeOffIcon />}
      </button>
    </ThemeProvider>
  );

  return sidemenu;
}
