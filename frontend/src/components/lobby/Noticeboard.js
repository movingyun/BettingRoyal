import { useEffect, useState } from "react";
import axios from "axios";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";

export default function Noticeboard() {
  useEffect(() => {}, []);
  
  let noticeboard = (
    <Grid container>
      공지사항
    </Grid>
  );

  return noticeboard;
}
