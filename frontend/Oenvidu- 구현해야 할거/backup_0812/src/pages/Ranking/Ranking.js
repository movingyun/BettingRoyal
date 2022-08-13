import { useEffect, useState } from "react";
import axios from "axios";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";import Box from '@mui/material/Box';
import { DataGrid } from "@mui/x-data-grid";
import styles from "./Ranking.module.css";

export default function Ranking(props) {
  useEffect(() => {
    //fetch rank
  }, []);


  const columns = [
    {
      field: "id",
      headerName: "순위",
      width: 90
    },
    {
        field: "tier",
        headerName: "티어",
        width: 30,
        editable: false,
      },
    {
      field: "nickname",
      headerName: "닉네임",
      width: 150,
      editable: false,
    },
    {
        field: "badge",
        headerName: "뱃지",
        width: 30,
        editable: false,
      },
    {
      field: "ruby",
      headerName: "보유 루비",
      width: 150,
      editable: false,
    },
    {
        field: "guild",
        headerName: "길드명",
        width: 150,
        editable: false,
      }
  ];

  const rows = [
    { id: 1, tier: "금",nickname: "유저1", badge:"다이아",ruby: 100, guild:"길드1"},
    { id: 2, tier: "은",nickname: "유저2",  badge:"다이아",ruby: 10, guild:"길드2"},
    { id: 3, tier: "동",nickname: "유저3",  badge:"다이아",ruby: 1, guild:"길드2"},
    
  ];

  let roomsdummy = (
    <Grid className={styles.container}>
      <Box sx={{ height: 400, width: "100%" }}>
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5]}
          disableSelectionOnClick
        />
      </Box>
      
    </Grid>
  );

  return roomsdummy;
}
