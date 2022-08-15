import React from "react"
import axios from "axios";
import { useEffect, useState } from "react";
import { Box, Grid } from "@material-ui/core";
import { DataGrid } from "@mui/x-data-grid";
import { Link, useNavigate } from "react-router-dom";

  
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
          field: "noticeTitle",
          headerName: "제목",
          width: 350,
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
          width: 70,
          editable: false,
      }
    ];

    const [nickname, setNickname] = useState();
    const [rows, setRows] = useState("");
    let navigate = useNavigate();
  

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

    function enterNotice(e){
      navigate("detail", { state: { noticeId:e.id } })
      //console.log(e.id);
    }

    return (
      <Grid>
        <Box sx={{ height: 631, width: "100%" }}>
        <DataGrid
          onRowClick={enterNotice}
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
