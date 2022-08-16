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
import { makeStyles } from "@material-ui/core/styles";
import { createStyles } from "@material-ui/core";
import AddCircleOutlineRoundedIcon from "@mui/icons-material/AddCircleOutlineRounded";

export default function Rooms(props) {
  const useStyles = makeStyles((theme) =>
    createStyles({
      grid: {
        fontFamily: "'Noto Sans KR', sans-serif",
        fontSize: "16px",
        fontWeight: "400",
      },
    })
  );

  const style = useStyles();

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
      .get("/api/user", {
        headers: {
          Authorization: window.localStorage.accessToken,
        },
      })
      .then(function (response) {
        if (isNaN(makeRoomBettingunit) || makeRoomBettingunit <= 0) {
          alert("최소 베팅단위는 1보다 커야 합니다");
        } else if (response.data.userRuby <= makeRoomBettingunit) {
          alert("보유 루비가 베팅 단위보다 적습니다");
        } else {
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
            .then(function (response2) {
              //console.log(JSON.stringify(response))
              setOpen(false);
              navigate("/room", {
                state: { roomId: response2.data.roomId, roomBetUnit: makeRoomBettingunit },
              });
            })
            .catch(function (error) {});
        }
      })
      .catch(function (error) {
        alert("내 루비 조회 실패");
      });
  }

  function enterRoom(e) {
    axios
      .get("/api/user", {
        headers: {
          Authorization: window.localStorage.accessToken,
        },
      })
      .then(function (userresponse) {
        axios
          .get("/api/room/" + e.row.id, {
            headers: {
              Authorization: window.localStorage.accessToken,
            },
          })
          .then(function (roomresponse) {
            console.log(userresponse.data.userRuby);
            console.log(roomresponse);
            if (userresponse.data.userRuby <= roomresponse.data.roomBettingUnit) {
              alert("보유 루비가 최소 베팅 금액보다 적습니다");
            } else if (roomresponse.data.current_count >= 6) {
              alert("정원이 가득찼습니다.");
            } else if (roomresponse.data.roomIsStart) {
              alert("게임이 진행중입니다");
            } else {
              navigate("/room", {
                state: { roomId: e.id, roomBetUnit: roomresponse.data.roomBettingUnit },
              });
            }
          })
          .catch(function (error) {
            alert("방 정보 가져오기 실패");
          });
        //[{roomId, userm, roomTitle, roomBettingUnit, roomPw}, ... ]
        //console.log(JSON.stringify(response.data));
        // return JSON.stringify(response.data.statusCode);
      })
      .catch(function (error) {
        alert("내 루비 조회 실패");
      });

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
        <AddCircleOutlineRoundedIcon sx={{ fontSize: 20, mr: 0.5, mb: 0.4 }} />방 만들기
      </button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent className={styles.createModal}>
          <div className={styles.modalTitle}>방 만들기</div>
          <div className={styles.modalExplain}>방장이 되어 게임에 참여하세요!</div>
          <div className={styles.modalInput}>
            <TextField
              color="action"
              id="standard-basic"
              label="방 제목"
              variant="standard"
              onChange={onRoomTitleHandler}
              className={styles.modalField}
            />
            {/* <TextField
              color="action"
              id="standard-basic"
              label="비밀번호"
              variant="standard"
              onChange={onRoomPwHandler}
              className={styles.modalField}
            /> */}
            <TextField
              color="action"
              id="standard-basic"
              label="루비 베팅 단위"
              variant="standard"
              onChange={onRoomBettingunitHandler}
              className={styles.modalField}
            />
          </div>
          <button className={styles.createBtn} onClick={makeRoom}>
            확인
          </button>
        </DialogContent>
      </Dialog>
    </Grid>
  );

  function makeRoomList(roomsdata) {
    let list = [];
    console.log(roomsdata);

    for (let i = 0; i < roomsdata.length; i++) {
      let room = new Object();
      room.id = roomsdata[i].roomId;
      room.roomTitle = roomsdata[i].roomTitle;
      room.roomBettingUnit = roomsdata[i].roomBettingUnit;
      room.isPw = roomsdata[i].roomPw;
      room.current_count = roomsdata[i].roomInCnt;
      room.max_count = 6;
      room.isStart = roomsdata[i].roomIsStart;
      if (!room.isStart) {
        list.push(room);
      }
    }
    return list;
  }
  //[{roomId, user, roomTitle, roomBettingUnit, roomPw}, ... ]
  const columns = [
    {
      field: "id",
      headerName: "방 번호",
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "roomTitle",
      headerName: "방 제목",
      flex: 4,
      editable: false,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "roomBettingUnit",
      headerName: "루비 베팅 단위",
      flex: 1.5,
      editable: false,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "current_count",
      headerName: "현재인원",
      flex: 1,
      editable: false,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "max_count",
      headerName: "정원",
      type: "number",
      flex: 1,
      editable: false,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "isPw",
      headerName: "비밀",
      sortable: false,
      flex: 1,
      editable: false,
      align: "center",
      headerAlign: "center",
    },
  ];

  // const rows = [
  //   { roomId: 1, roomTitle: "방1",roomBettingUnit:1, current_count: 1, max_count: 6 , roomPw: "" },
  //   { roomId: 2, roomTitle: "방2", current_count: 1, max_count: 6 , roomPw: "" },
  //   { roomId: 3, roomTitle: "방3", current_count: 1, max_count: 6 , roomPw: "ㅇ" },

  // ];

  let roomsdummy = (
    <Grid>
      {roomcreate}
      {/* <Link to="/room" state={{ roomid: 1 }}>
        게임방 테스트
      </Link> */}
      <Box sx={{ height: 500, width: "100%" }}>
        <DataGrid
          className={style.grid}
          onRowClick={enterRoom}
          rows={rooms}
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
