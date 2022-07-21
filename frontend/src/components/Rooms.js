import { useEffect, useState } from "react";
import axios from "axios";
import styles from "./LoginMain.module.css";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Sidemenu from "./Sidemenu";

export default function Rooms(props) {
  useEffect(() => {
    //fetch room list
  }, []);

  let rooms = (
    <Grid container>
      <Grid item xs={6}>방1</Grid>
      <Grid item xs={6}>방2</Grid>
      <Grid item xs={6}>방3</Grid>
      <Grid item xs={6}>방4</Grid>
    </Grid>
  );

  return rooms;
}
