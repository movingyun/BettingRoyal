import React from "react"
import axios from "axios";
import { useEffect, useState } from "react";
import Link from '@mui/material/Link';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { Box, Grid } from "@material-ui/core";
import { DataGrid } from "@mui/x-data-grid";

  
  function preventDefault(event) {
    event.preventDefault();
  }
  
  export default function Orders() {

    const columns = [ 
      {
        field: "id",
        headerName: "No.",
        width: 90
      },
      {
          field: "noticeTitle",
          headerName: "제목",
          width: 150,
          editable: false,
      },
      {
        field: "userNickname",
        headerName: "닉네임",
        width: 150, 
        editable: false,
      },
      {
        field: "noticeDate",
        headerName: "작성 일자",
        width: 150,
        editable: false,
      },
      {
          field: "noticeHit",
          headerName: "조회수",
          width: 50,
          editable: false,
      }
    ];

    const [nickname, setNickname] = useState();
    const [rows, setRows] = useState("");
    

    useEffect(()=> {
      axios
      .get("/api/notice", {
        headers: {
          Authorization: window.localStorage.accessToken,
          "Content-Type": "application/json",
        },
      }) 
      .then((response)=> {
        console.log("공지사항 : " + JSON.stringify(response.data));
        setRows(response.data); 
      })
      .catch((error)=> { 
        console.log(error); 
      });
    },[])

    return (
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
}
