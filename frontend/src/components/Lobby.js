import { useEffect, useState } from "react";
import axios from "axios";
import styles from "./LoginMain.module.css";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Sidemenu from "./Sidemenu";
import Noticeboard from "./Noticeboard";
import Rooms from "./Rooms";

export default function Lobby(props) {
  useEffect(() => {}, []);
  
  let sidemenu = (
    <Grid container>
      <Grid item container xs={3}>
        <Sidemenu />
      </Grid>
      <Grid item container xs={9}>
          <Routes>
          <Route path="rooms" element ={<Rooms/>} ></Route>
            <Route path="noticeboard" element ={<Noticeboard/>} ></Route>
            <Route path="rank" ></Route>
            <Route path="friend" ></Route>
          </Routes>
      </Grid>
    </Grid>
  );

  return sidemenu;
}
