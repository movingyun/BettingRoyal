import React from "react";
import { useEffect, useState } from "react";
import { Grid, Box, Toolbar, Container, Paper } from "@mui/material";
import axios, { Axios } from "axios";
import Button from "@mui/material/Button";
import { DataGrid } from "@mui/x-data-grid";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';import { color } from "@mui/system";
import rubyicon from "../../images/icon/ruby.png";
import Typography from "@mui/material/Typography";
import styles from "./Friend.module.css";
import PersonAddRoundedIcon from '@mui/icons-material/PersonAddRounded';
import NotListedLocationRoundedIcon from '@mui/icons-material/NotListedLocationRounded';

export default function FriendRequest(props) {
  const [rows, setRows] = useState("");
  const [nickname, setNickname] = useState("");
  const [nickcheck, setNickcheck] = useState("");

  const onNickNameHandler = (event) => {
    setNickname(event.currentTarget.value);
  };

  useEffect(() => {
    axios
      .get("/api/user/search/_", {
        headers: {
          Authorization: window.localStorage.accessToken,
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        console.log(response.data);
        setRows(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  async function requestFriendBtn(params) {
    console.log(params.row.friendId);
    await reqFriend(params);
    await searchUser();
  }

  async function reqFriend(params) {
    await axios
      .post("/api/friends", null, {
        params: { getFriendToUserId: params.row.friendId },

        headers: {
          Authorization: window.localStorage.accessToken,
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  async function searchUser() {
    if (nickname.trim() == "") {
      setNickcheck(<p style={{ color: "red" }}>닉네임을 입력하세요.</p>);
      return;
    } else {
      setNickcheck("");
    }

    await axios
      .get("/api/user/search/" + nickname, {
        headers: {
          Authorization: window.localStorage.accessToken,
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        console.log(response.data);
        setRows(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  const columns = [
    {
      field: "nickname",
      headerName: "닉네임",
      minWidth: 150,
      flex: 1,
      editable: false,
      headerAlign: "center",
      align: "center",
    },
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
      field: "friendId",
      headerName: "친구요청",
      minWidth: 150,
      flex: 1,
      editable: false,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => (
        <strong>
          <Button className={styles.add}
            onClick={() => {
              requestFriendBtn(params);
            }}
          >
            <PersonAddRoundedIcon className={styles.icon}/> 친구요청
          </Button>
        </strong>
      ),
    },
  ];

  let friendReqs = (
    <Grid>
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <SearchRoundedIcon className={styles.searchIcon} />
        <TextField
          className={styles.searchField}
          color="action"
          name="nickName"
          // required
          fullWidth
          id="nickname"
          label="닉네임 검색"
          onChange={onNickNameHandler}
          autoFocus
        />
        <Button
        className={styles.searchBtn}
          onClick={() => {
            searchUser();
          }}
        >
          검색
        </Button>
      </Box>
      <p>{nickcheck}</p>
      <Box sx={{ height: 400, width: "100%" }}>
        <DataGrid
          className={styles.grid}
          rows={rows}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5]}
          disableSelectionOnClick
          components={{
            NoRowsOverlay: () => (
              <Box height="100%" textAlign="center" alignContent="center">
                <Box sx={{ mt: "10%" }}>
                <NotListedLocationRoundedIcon className={styles.none}/>
                <p className={styles.alert}>검색 결과가 없습니다.</p>
                </Box>
              </Box>
            ),
          }}
        />
      </Box>
    </Grid>
  );

  return friendReqs;
}
