import { useEffect, useState } from "react";
import axios from "axios";
import { BrowserRouter, Routes, Route, Link, useNavigate ,useLocation} from "react-router-dom";
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
import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import ArrowForwardIosRoundedIcon from "@mui/icons-material/ArrowForwardIosRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import Modal from "../../components/Modal/Modal";
import Kick from "../../pages/modal/kick/kick";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: "#DCD7C9",
  padding: "10px 15px 10px 15px",
  height: "105px",
  borderRadius: "5px",
  boxShadow: "none",
  fontFamily: "'Noto Sans KR', sans-serif",
  "&:hover": {
    backgroundColor: "#A27B5C",
  },
}));

export default function Rooms(props,route) {
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

  const [allRooms, setAllRooms] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [makeRoomTitle, setMakeRoomTitle] = useState("");
  const [makeRoomBettingunit, setMakeRoomBettingunit] = useState();
  const [roomCnt, setRoomCnt] = useState();
  const [makeRoomPw, setMakeRoomPw] = useState("");
  const [page, setPage] = useState(1);
  const [kickmodal, setkickmodal] = useState(false)

  let navigate = useNavigate();
  let location = useLocation();


  useEffect(() => {
    //fetch room list
    console.log(location.state)
    if (location.state) {
      setkickmodal(true)
      
    }
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
        console.log(response.data);
        setAllRooms(response.data);
        setRoomCnt(response.data.length);
        setRooms(makeRoomList(response.data, 1));
      })
      .catch(function (error) {
        console.log(error);
        alert("방 정보 가져오기 실패");
      });
  }, []);

  let fetchedRooms = <Grid container></Grid>;

  const [open, setOpen] = useState(false);

  const handleChange = (event, value) => {
    setPage(value);
    setRooms(makeRoomList(allRooms, value));
  };

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
              props.bgmState("false");
              navigate("/room", {
                state: {
                  roomId: response2.data.roomId,
                  roomBetUnit: makeRoomBettingunit,
                  roomTitle: response2.data.roomTitle,
                },
              });
            })
            .catch(function (error) {});
        }
      })
      .catch(function (error) {
        console.log(error);
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
          .get("/api/room/" + e, {
            headers: {
              Authorization: window.localStorage.accessToken,
            },
          })
          .then(function (roomresponse) {
            if (userresponse.data.userRuby <= roomresponse.data.roomBettingUnit) {
              alert("보유 루비가 최소 베팅 금액보다 적습니다");
            } else if (roomresponse.data.current_count >= 6) {
              alert("정원이 가득찼습니다.");
            } else if (roomresponse.data.roomIsStart) {
              alert("게임이 진행중입니다");
            } else if (roomresponse.data.roomIsClose) {
              alert("방이 닫혔습니다");
            } else {
              props.bgmState("false");
              navigate("/room", {
                state: {
                  roomId: e,
                  roomBetUnit: roomresponse.data.roomBettingUnit,
                  roomTitle: roomresponse.data.roomTitle,
                },
              });
            }
          })
          .catch(function (error) {
            console.log(error);
            alert("방 정보 가져오기 실패");
          });
      })
      .catch(function (error) {
        console.log(error);
        alert("내 루비 조회 실패");
      });
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
          <button className={styles.okBtn} onClick={makeRoom}>
            확인
          </button>
        </DialogContent>
      </Dialog>
    </Grid>
  );

  function makeRoomList(roomsdata, value) {
    console.log(page + "여기ㅣㅣㅣㅣㅣㅣㅣ");
    let list = [];
    for (let i = 8 * (value - 1); i < 8 * value; i++) {
      if (i >= roomsdata.length) {
        continue;
      }
      let room = new Object();
      room.id = roomsdata[i].id;
      room.roomTitle = roomsdata[i].roomTitle;
      room.roomBettingUnit = roomsdata[i].roomBettingUnit;
      room.isPw = roomsdata[i].roomPw;
      room.current_count = roomsdata[i].roomInCnt;
      room.max_count = 6;
      console.log(JSON.stringify(roomsdata[i]));
      list.push(room);
    }
    return list;
  }

  function closeModal  ()  {
    setkickmodal(false);
  };

  let roomsdummy = (
    <Grid>
      <Modal open={kickmodal} close={closeModal} header="루비가 부족합니다">
        <Kick />
      </Modal>
      {roomcreate}
      <Grid container rowSpacing={"10px"} columnSpacing={"10px"}>
        {rooms.map((item, index) => (
          <Grid item xs={6}>
            <Item
              onClick={() => {
                enterRoom(item.id);
              }}
            >
              <div className={styles.roomNo}>{item.id}</div>
              <div className={styles.roomName}>{item.roomTitle}</div>
              <ArrowForwardIosRoundedIcon className={styles.roomIcon} />
              <hr className={styles.roomDiv} />
              <div className={styles.roomBot}>
                <div className={styles.betRuby}>최소 배팅 {item.roomBettingUnit} 루비</div>
                <div className={styles.peopleNum}>
                  <PersonRoundedIcon sx={{ fontSize: 20, mr: 0.5, mb: 0.4 }} />
                  {item.current_count}/6
                </div>
              </div>
            </Item>
          </Grid>
        ))}
      </Grid>
      <div className={styles.pageDiv}>
        <Pagination
          className={styles.page}
          count={roomCnt % 8 == 0 ? parseInt(roomCnt / 8) : parseInt(roomCnt / 8 + 1)}
          onChange={handleChange}
          page={page}
        />
      </div>
    </Grid>
  );

  return roomsdummy;
}
