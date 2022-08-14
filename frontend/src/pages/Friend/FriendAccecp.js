import React from "react";
import { useEffect, useState } from "react";
import { Grid, Box, Toolbar, Container, Paper } from "@mui/material";
import axios, { Axios } from "axios";
import Button from "@mui/material/Button";
import { DataGrid } from "@mui/x-data-grid";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import rubyicon from "../../images/icon/ruby.png";

export default function FriendRequest(props) {
  const [rows, setRows] = useState("");

  useEffect(() => {
    axios
      .get("/api/friends/request", {
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

  async function acceptFriendBtn(params) {
    console.log(params.row.friendId);
    await acceptFriend(params);
    await findFriend();
  }

  async function acceptFriend(params) {
    await axios
      .put("/api/friends", null, {
        params: { getFriendId: params.row.friendId },

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

  async function findFriend() {
    await axios
      .get("/api/friends/request", {
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
      headerName: "친구수락",
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
              acceptFriendBtn(params);
            }}
          >
            친구수락
          </Button>
        </strong>
      ),
    },
  ];

  let friendAccecp = (
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

  return friendAccecp;
}
