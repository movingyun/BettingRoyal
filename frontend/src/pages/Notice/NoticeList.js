import React from "react"
import axios from "axios";
import { useEffect, useState } from "react";
import { Box, Grid } from "@material-ui/core";
import { DataGrid } from "@mui/x-data-grid";
import { Link, useNavigate } from "react-router-dom";
import styles from "./Notice.module.css";
import {makeStyles} from "@material-ui/core/styles";
import {createStyles} from "@material-ui/core";
  
  function preventDefault(event) {
    event.preventDefault();
  }
  
  export default function Orders() {

    const useStyles = makeStyles((theme) => createStyles({
      grid: {
        fontFamily: "'Noto Sans KR', sans-serif",
        fontSize: '16px',
        fontWeight: '400',
      },    
    }));

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
          field: "noticeTitle",
          headerName: "제목",
          flex: 5,
          editable: false,
          align: "center",
          headerAlign: "center",
      },
      // {
      //   field: "userNickname", 
      //   headerName: "닉네임",
      //   flex: 2,
      //   editable: false,
      //   align: "center",
      //   headerAlign: "center",
      // },
      {
        field: "noticeDate",
        headerName: "작성 일자",
        flex: 2,
        editable: false,
        align: "center",
        headerAlign: "center",
      },
      {
          field: "noticeHit",
          headerName: "조회수",
          wflex: 1,
          editable: false,
          align: "center",
          headerAlign: "center",
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
        <Box sx={{ height: 500, width: "100%" }}>
        <DataGrid
          className={styles.grid}
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
