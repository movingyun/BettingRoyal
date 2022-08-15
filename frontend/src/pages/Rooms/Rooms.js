import { useEffect, useState } from "react";
import axios from "axios";
import { BrowserRouter, Routes, Route, Link, useNavigate } from "react-router-dom";
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
import styles from "./Rooms.module.css";

export default function Rooms(props) {
  const [rooms, setRooms] = useState([]);
  const [makeRoomTitle, setMakeRoomTitle] = useState("");
  const [makeRoomBettingunit, setMakeRoomBettingunit] = useState();
  const [makeRoomPw, setMakeRoomPw] = useState("");
  let navigate = useNavigate();

  useEffect(() => {
    //fetch room list
    axios
      .get("/api/room", {
        headers: {
          Authorization: window.localStorage.accessToken,
        },
      })
      .then(function (response) {
        //[{roomId, userm, roomTitle, roomBettingUnit, roomPw}, ... ]
        //console.log(JSON.stringify(response.data));
        // return JSON.stringify(response.data.statusCode);

        setRooms(makeRoomList(response.data));
      })
      .catch(function (error) {
        alert("방 정보 가져오기 실패");
      });
  }, []);

  let fetchedRooms = <Grid container></Grid>;

  const [open, setOpen] = useState(false);

  const handlemakeroom = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  function makeRoom() {
    axios
      .post(
        "/api/room",
        {
          roomTitle: makeRoomTitle,
          roomBettingUnit: makeRoomBettingunit,
        },
        {
          headers: {
            Authorization: window.localStorage.accessToken,
          },
        }
      )
      .then(function (response) {
        //console.log(JSON.stringify(response))
        setOpen(false);
        navigate("/room", { state: { roomId:response.data.roomId } });
      })
      .catch(function (error) {});
  }

  function enterRoom(e){
    navigate("/room", { state: { roomId:e.id } })
    //console.log(e.id);
  }

  const onRoomTitleHandler = (event) => {
    setMakeRoomTitle(event.currentTarget.value);
  };
  const onRoomBettingunitHandler = (event) => {
    setMakeRoomBettingunit(event.currentTarget.value);
  };
  const onRoomPwHandler = (event) => {
    setMakeRoomPw(event.currentTarget.value);
  };

  let roomcreate = (
    <Grid item xs={12}>
      <button className={styles.createBtn} onClick={handlemakeroom}>
        방 만들기
      </button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent className={styles.createModal}>
          <div className={styles.modalTitle}>
            방 만들기
          </div>
          <div className={styles.modalExplain}>
            방장이 되어 게임에 참여하세요!
          </div>
          <div className={styles.modalInput}>
            <TextField
              color="action"
              id="standard-basic"
              label="방 제목"
              variant="standard"
              onChange={onRoomTitleHandler}
              className={styles.modalField}
            />
            <TextField
              color="action"
              id="standard-basic"
              label="비밀번호"
              variant="standard"
              onChange={onRoomPwHandler}
              className={styles.modalField}
            />
            <TextField
              color="action"
              id="standard-basic"
              label="루비 베팅 단위"
              variant="standard"
              onChange={onRoomBettingunitHandler}
              className={styles.modalField}
            />
          </div>
          <button className={styles.createBtn} onClick={makeRoom}>확인</button>
        </DialogContent>
      </Dialog>
    </Grid>
  );

  function makeRoomList(roomsdata) {
    let list = [];
    for (let i = 0; i < roomsdata.length; i++) {
      let room = new Object();
      room.id = roomsdata[i].roomId;
      room.roomTitle = roomsdata[i].roomTitle;
      room.roomBettingUnit = roomsdata[i].roomBettingUnit;
      room.isPw = roomsdata[i].roomPw;
      room.current_count = 1;
      room.max_count = 1;
      console.log(JSON.stringify(room));
      list.push(room);
    }
    return list;
  }
  //[{roomId, user, roomTitle, roomBettingUnit, roomPw}, ... ]
  const columns = [
    { field: "id", headerName: "방 번호", width: 90 },
    {
      field: "roomTitle",
      headerName: "방 제목",
      width: 150,
      editable: false,
    },
    {
      field: "roomBettingUnit",
      headerName: "베팅 단위",
      width: 50,
      editable: false,
    },
    {
      field: "current_count",
      headerName: "현재인원",
      width: 50,
      editable: false,
    },
    {
      field: "max_count",
      headerName: "정원",
      type: "number",
      width: 110,
      editable: false,
    },
    {
      field: "isPw",
      headerName: "비밀 방",
      sortable: false,
      width: 160,
      editable: false,
    },
  ];

  // const rows = [
  //   { roomId: 1, roomTitle: "방1",roomBettingUnit:1, current_count: 1, max_count: 6 , roomPw: "" },
  //   { roomId: 2, roomTitle: "방2", current_count: 1, max_count: 6 , roomPw: "" },
  //   { roomId: 3, roomTitle: "방3", current_count: 1, max_count: 6 , roomPw: "ㅇ" },

  // ];

  let roomsdummy = (
    <Grid >
      {roomcreate}
      <Link to="/room" state={{ roomid: 1 }}>
        게임방 테스트
      </Link>
      <Box sx={{ height: 400, width: "100%" }}>
        <DataGrid
          onRowClick={enterRoom}
          rows={rooms}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5]}
          disableSelectionOnClick
        />
      </Box>
    </Grid>
  );

  return roomsdummy;
}
