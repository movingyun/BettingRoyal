import { useEffect, useState } from "react";
import axios from "axios";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";import Box from '@mui/material/Box';
import { DataGrid } from "@mui/x-data-grid";

export default function Rooms(props) {
  const [rooms, setRooms] = useState([]);
  useEffect(() => {
    //fetch room list
  }, []);

  let fetchedRooms = <Grid container></Grid>;

  const [open, setOpen] = useState(false);

  const handlemakeroom = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  let roomcreate = (
    <Grid item xs={12}>
      <Button variant="outlined" onClick={handlemakeroom}>
        방만들기
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent>
          <div>
            <TextField id="standard-basic" label="방제목" variant="standard" />
          </div>
          <div>
            <TextField
              id="standard-basic"
              label="비밀번호"
              variant="standard"
            />
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>만들기</Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );

  const columns = [
    { field: "id", headerName: "방 번호", width: 90 },
    {
      field: "roomname",
      headerName: "방 제목",
      width: 150,
      editable: false,
    },
    {
      field: "current_count",
      headerName: "현재인원",
      width: 150,
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
      field: "password",
      headerName: "비밀 방",
      sortable: false,
      width: 160,
      editable: false,
    },
  ];

  const rows = [
    { id: 1, roomname: "방1", current_count: 1, max_count: 6 , password: "" },
    { id: 2, roomname: "방2", current_count: 1, max_count: 6 , password: "" },
    { id: 3, roomname: "방3", current_count: 1, max_count: 6 , password: "ㅇ" },
    
  ];

  let roomsdummy = (
    <Grid container>
      {roomcreate}
      <Box sx={{ height: 400, width: "100%" }}>
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5]}
          checkboxSelection
          disableSelectionOnClick
        />
      </Box>
      
    </Grid>
  );

  return roomsdummy;
}
