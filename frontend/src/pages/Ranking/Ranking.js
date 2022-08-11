import { useEffect, useState } from "react";
import axios, { Axios } from "axios";
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

  const [rows, setRows] = useState("");

 
  useEffect(() => {
    axios
      .get("http://localhost:8080/api/rank")
      .then((response) => {
        console.log(response);
        setRows(response.data);
      })
      .catch((error) => {
        console.log(error);
      })
  }, []);

  const columns = [
    {
      field: "id",
      headerName: "순위",
      width: 90
    },
    // {
    //     field: "tier",
    //     headerName: "티어",
    //     width: 30,
    //     editable: false,
    //   },
    {
      field: "nickname",
      headerName: "닉네임",
      width: 150,
      editable: false,
    },
    // {
    //     field: "badge",
    //     headerName: "뱃지",
    //     width: 30,
    //     editable: false,
    //   },
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

  let roomsdummy = (
    <Grid>
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