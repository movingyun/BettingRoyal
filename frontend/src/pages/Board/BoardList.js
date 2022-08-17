import React from "react";
import axios from "axios";
import { useEffect, useState } from "react";
import { Box, Grid } from "@material-ui/core";
import { DataGrid } from "@mui/x-data-grid";
import { Link, Route, Routes, useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
import styles from "./Board.module.css";
import { makeStyles } from "@material-ui/core/styles";
import { createStyles } from "@material-ui/core";
import AddCircleOutlineRoundedIcon from "@mui/icons-material/AddCircleOutlineRounded";

function preventDefault(event) {
  event.preventDefault();
}

export default function Orders() {
  const useStyles = makeStyles((theme) =>
    createStyles({
      grid: {
        fontFamily: "'Noto Sans KR', sans-serif",
        fontSize: "16px",
        fontWeight: "400",
      },
      createBtn: {
        fontSize: "large",
        backgroundColor: "#f7f3e9",
        color: "#A27B5C",
        border: "none",
        padding: "6px",
        textAlign: "center",
        textDecoration: "none",
        display: "inline-block",
        cursor: "pointer",
        borderRadius: "5px",
        width: "150px",
        fontFamily: "'Noto Sans KR', sans-serif",
        fontWeight: "500",
        marginBottom: "10px",
        "&:hover": {
          backgroundColor: "#DCD7C9",
          color: "#A27B5C",
        },
      },
    })
  );

  const styles = useStyles();

  const columns = [
    {
      field: "id",
      headerName: "글번호",
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "boardTitle",
      headerName: "제목",
      flex: 5,
      editable: false,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "userNickname",
      headerName: "닉네임",
      flex: 2,
      editable: false,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "boardDate",
      headerName: "작성 일자",
      flex: 2,
      editable: false,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "boardHit",
      headerName: "조회수",
      flex: 1,
      editable: false,
      align: "center",
      headerAlign: "center",
    },
  ];

  const [nickname, setNickname] = useState();
  const [rows, setRows] = useState("");
  let navigate = useNavigate();

  useEffect(() => {
    axios
      .get("/api/board", {
        headers: {
          Authorization: window.localStorage.accessToken,
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        // console.log("게시판 : " + JSON.stringify(response.data));
        setRows(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  function enterBoard(e) {
    navigate("detail", { state: { boardId: e.id } });
    //console.log(e.id);
  }

  return (
    <Grid>
      <Link to="boardwrite">
        <button className={styles.createBtn}>
          <AddCircleOutlineRoundedIcon sx={{ fontSize: 20, mr: 0.5, mb: 0.4 }} />
          글작성
        </button>
      </Link>
      <Box sx={{ height: 500, width: "100%" }}>
        <DataGrid
          className={styles.grid}
          onRowClick={enterBoard}
          rows={rows}
          columns={columns}
          pageSize={10}
          rowsPerPageOptions={[5]}
          disableSelectionOnClick
        />
      </Box>
    </Grid>
  );
}
