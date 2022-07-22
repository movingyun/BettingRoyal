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

export default function Rooms(props) {
  useEffect(() => {
    //fetch rank
  }, []);


  const columns = [
    { field: "id", headerName: "순위", width: 90 },
    {
      field: "nickname",
      headerName: "닉네임",
      width: 150,
      editable: false,
    },
    {
      field: "ruby",
      headerName: "보유 루비",
      width: 150,
      editable: false,
    }
  ];

  const rows = [
    { id: 1, nickname: "유저1", ruby: 100,},
    { id: 2, nickname: "유저2", ruby: 10, },
    { id: 3, nickname: "유저3", ruby: 1, },
    
  ];

  let roomsdummy = (
    <Grid container>
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
