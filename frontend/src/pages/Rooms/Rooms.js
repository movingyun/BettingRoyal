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
import {makeStyles} from "@material-ui/core/styles";
import {createStyles} from "@material-ui/core";
import AddCircleOutlineRoundedIcon from '@mui/icons-material/AddCircleOutlineRounded';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import ArrowForwardIosRoundedIcon from '@mui/icons-material/ArrowForwardIosRounded';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: '#DCD7C9',
  padding: '10px 15px 10px 15px',
  height: '105px',
  borderRadius: '5px',
  boxShadow: 'none',
  fontFamily: "'Noto Sans KR', sans-serif",
  '&:hover': {
    backgroundColor: '#A27B5C',
  },
}));

export default function Rooms(props) {
  const useStyles = makeStyles((theme) => createStyles({
    grid: {
      fontFamily: "'Noto Sans KR', sans-serif",
      fontSize: '16px',
      fontWeight: '400',
    },    
  }));

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
      <AddCircleOutlineRoundedIcon sx={{ fontSize: 20, mr:0.5, mb:0.4 }} />방 만들기
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
          <button className={styles.okBtn} onClick={makeRoom}>확인</button>
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

  let roomsdummy = (
    <Grid >
      {roomcreate}
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
      <Grid container rowSpacing={'10px'} columnSpacing={'10px'}>
        <Grid item xs={6}>
          <Item>
            <div className={styles.roomNo}>No. 1111</div>
            <div className={styles.roomName}>방제목</div>
            <ArrowForwardIosRoundedIcon className={styles.roomIcon} />
            <hr className={styles.roomDiv}/>
            <div className={styles.roomBot}>
              <div className={styles.betRuby}>최소 배팅 10 루비</div>
              <div className={styles.peopleNum}><PersonRoundedIcon sx={{ fontSize: 20, mr:0.5, mb:0.4 }}/>3/6</div>
            </div>
          </Item>
        </Grid>
        <Grid item xs={6}>
          <Item>2</Item>
        </Grid>
        <Grid item xs={6}>
          <Item>3</Item>
        </Grid>
        <Grid item xs={6}>
          <Item>4</Item>
        </Grid>
        <Grid item xs={6}>
          <Item>5</Item>
        </Grid>
        <Grid item xs={6}>
          <Item>6</Item>
        </Grid>
        <Grid item xs={6}>
          <Item>7</Item>
        </Grid>
        <Grid item xs={6}>
          <Item>8</Item>
        </Grid>
      </Grid>
      <div className={styles.pageDiv}><Pagination className={styles.page} count={10} /></div>
    </Grid>
  );

  return roomsdummy;
}
