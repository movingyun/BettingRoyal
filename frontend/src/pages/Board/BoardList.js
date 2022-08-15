import React from "react"
import axios from "axios";
import { useEffect, useState } from "react";
import { Box, Grid } from "@material-ui/core";
import { DataGrid } from "@mui/x-data-grid";
import { Link, Route, Routes, useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
import styles from "./Board.module.css";
  
  function preventDefault(event) {
    event.preventDefault();
  }
  
  export default function Orders() {

    const columns = [ 
      {
        field: "id",
        headerName: "No.", 
        width: 70
      },
      {
          field: "boardTitle", 
          headerName: "제목",
          width: 350,
          editable: false,
      },
      {
        field: "userNickname",
        headerName: "닉네임",
        width: 100, 
        editable: false,
      },
      {
        field: "boardDate",
        headerName: "작성 일자",
        width: 150,
        editable: false,
      },
      {
        field: "boardLike",
        headerName: "좋아요수",
        width: 50,
        editable: false,
      },
      {
          field: "boardHit",
          headerName: "조회수",
          width: 50,
          editable: false,
      }
    ];

    const [nickname, setNickname] = useState();
    const [rows, setRows] = useState("");
    let navigate = useNavigate();

    useEffect(()=> {
      axios
      .get("/api/board", {
        headers: {
          Authorization: window.localStorage.accessToken,
          "Content-Type": "application/json",
        },
      }) 
      .then((response)=> {
        // console.log("게시판 : " + JSON.stringify(response.data));
        setRows(response.data); 
      })
      .catch((error)=> { 
        console.log(error); 
      });
    },[])

    function enterBoard(e){
      navigate("detail", { state: { boardId:e.id } })
      //console.log(e.id);
  }

    return (
      <Grid>
        <Link to="boardwrite"><button className={styles.createBtn}>글작성</button></Link>
        <Box sx={{ height: 631, width: "100%" }}>
        <DataGrid
          onRowClick={enterBoard}
          rows={rows}
          columns={columns}
          pageSize={10}
          rowsPerPageOptions={[6]}
          disableSelectionOnClick
        />
        </Box>
      </Grid>
  );
}
