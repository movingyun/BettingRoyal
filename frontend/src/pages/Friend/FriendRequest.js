import React from "react";
import { useEffect, useState } from "react";
import { Grid, Box, Toolbar, Container, Paper } from "@mui/material";
import axios, { Axios } from "axios";
import Button from "@mui/material/Button";
import { DataGrid } from "@mui/x-data-grid";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import { color } from "@mui/system";
import rubyicon from "../../images/icon/ruby.png";

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
    if (!nickname) {
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
          <Button
            startIcon={<PersonAddIcon />}
            onClick={() => {
              requestFriendBtn(params);
            }}
          >
            친구요청
          </Button>
        </strong>
      ),
    },
  ];

  let friendReqs = (
    <Grid>
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <SearchIcon sx={{ color: "action.active", mr: 1, mb: 0 }} />
        <TextField
          color="action"
          autoComplete="given-name"
          name="nickName"
          required
          fullWidth
          id="nickname"
          label="닉네임"
          onChange={onNickNameHandler}
          autoFocus
        />
        <Button
          color="inherit"
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
          rows={rows}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5]}
          disableSelectionOnClick
        />
      </Box>
    </Grid>
  );

  return friendReqs;
}
