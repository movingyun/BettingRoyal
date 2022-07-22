import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Sidemenu from "../../components/Lobbycomp/Sidemenu";
import Noticeboard from "../../components/Lobbycomp/Noticeboard";
import Rooms from "../../components/Lobbycomp/Rooms";
import Headerbar from "../../components/Headerbar";

export default function Lobby(props) {
  useEffect(() => {}, []);
  
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
            <Route path="mypage" ></Route>
          </Routes>
      </Grid>
    </Grid>
  );

  return sidemenu;
}
