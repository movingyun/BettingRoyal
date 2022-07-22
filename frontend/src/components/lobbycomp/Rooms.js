import { useEffect, useState } from "react";
import axios from "axios";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Sidemenu from "./Sidemenu";

export default function Rooms(props) {
    const [rooms,setRooms]=useState([]);
  useEffect(() => {
    //fetch room list

  }, []);

  

  let fetchedRooms=(
    <Grid container>
        
    </Grid>
  )


  let roomsdummy = (
    <Grid container>
      <Grid item xs={6}>방1</Grid>
      <Grid item xs={6}>방2</Grid>
      <Grid item xs={6}>방3</Grid>
      <Grid item xs={6}>방4</Grid>
    </Grid>
  );

  return roomsdummy;
}
