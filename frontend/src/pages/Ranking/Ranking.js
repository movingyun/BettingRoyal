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
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";
import styles from "./Ranking.module.css";
import rubyicon from "../../images/icon/ruby.png";

export default function Ranking(props) {
  const [rows, setRows] = useState("");

  useEffect(() => {
    axios
      .get("/api/rank")
      .then((response) => {
        console.log("OK" + response.data);
        console.log(response.data);
        setRows(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const columns = [
    {
      field: "id",
      headerName: "순위",
      minWidth: 50,
      maxWidth: 85,
      flex: 1,
      editable: false,
      headerAlign: "center",
      align: "center",
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
      minWidth: 150,
      flex: 1,
      editable: false,
      headerAlign: "center",
      align: "center",
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
      minWidth: 150,
      flex: 1,
      editable: false,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => (
        <strong>
          <img src={rubyicon} height="15" width="15" />
          &nbsp;{params.row.ruby}&nbsp;루비
        </strong>
      ),
    },
    {
      field: "total",
      headerName: "전적",
      minWidth: 150,
      flex: 1,
      editable: false,
      headerAlign: "center",
      align: "center",
    },
  ];

  let roomsdummy = (
    <Grid>
      <Box sx={{ height: 631, width: "100%" }}>
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={10}
          rowsPerPageOptions={[5]}
          disableSelectionOnClick
        />
      </Box>
    </Grid>
  );

  return roomsdummy;
}
