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
import gold from "../../images/icon/gold-medal.png";
import silver from "../../images/icon/silver-medal.png";
import bronze from "../../images/icon/bronze-medal.png";
import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";

const useStyles = makeStyles({
  grid: {
    fontFamily: "'Noto Sans KR', sans-serif",
    fontSize: "16px",
    fontWeight: "400",
  },
  rank: {
    color: "#A27B5C",
    fontSize: "18px",
  },
});

export default function Ranking(props) {
  const styles = useStyles();

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
      cellClassName: (params) => {
        return clsx("super-app", {
          colored: params.row.id === 1,
        });
      },
      renderCell: (params) => (
        <div className={styles.rank}>
          {params.row.id === 1 && <img src={gold} height="25" />}
          {params.row.id === 2 && <img src={silver} height="25" />}
          {params.row.id === 3 && <img src={bronze} height="25" />}
          {params.row.id > 3 && <div>{params.row.id}</div>}
        </div>
      ),
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
        <div>
          <img src={rubyicon} height="16" width="16" />
          &nbsp;
          {params.row.ruby == null
            ? params.row.ruby
            : params.row.ruby.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
          &nbsp;루비
        </div>
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
      <Box
        sx={{
          height: 631,
          width: "100%",
          "& .super-app.colored": {
            // backgroundColor: 'aqua',
          },
        }}
      >
        <DataGrid
          className={styles.grid}
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
