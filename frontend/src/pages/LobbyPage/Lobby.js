import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Sidemenu from "../../components/lobbycomp/Sidemenu";
import Noticeboard from "../Noticepage/Noticeboard";
import Rooms from "../../components/lobbycomp/Rooms";
import Rank from "../Rankpage/Rank";
import Sockjs from "sockjs-client";
import MyPage from "../MyPage/MyPage";
import Headerbar from "../../components/Headerbar";

export default function Lobby(props) {
  useEffect(() => {}, []);

  function socketConnect() {
    let socket = new Sockjs("(proxy)/url");

    socket.onopen = function () {
      //소켓 전송

      //소켓 수신
      socket.onmessage = function (event) {
        var contents = JSON.parse(event.data);
        console.log("Type:", contents.type);
        console.log("ReceivedMessage:", contents);

        messageType(contents);
      };
    };
  }

  function socketSend() {}

  function messageType(contents) {}

  let sidemenu = (
    <Grid container>
      <Grid item container xs={3}>
        <Sidemenu />
      </Grid>
      <Headerbar />
      <Grid item container xs={9}>
          <Routes>
          <Route path="rooms" element ={<Rooms/>} ></Route>
            <Route path="noticeboard" element ={<Noticeboard/>} ></Route>
            <Route path="rank" ></Route>
            <Route path="friend" ></Route>
            <Route path="mypage" element ={<MyPage/>}></Route>
          </Routes>
      </Grid>
    </Grid>
  );

  return sidemenu;
}
