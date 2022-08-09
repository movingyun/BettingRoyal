/* eslint-disable */
import { useParams, useHistory } from "react-router-dom";
import { useState, useEffect } from "react";
import { Form, Button } from "react-bootstrap";
import {
  Container,
  CssBaseline,
  Box,
  Typography,
  TextField,
  Button as MuiButton,
} from "@mui/material";
import axios from "axios";

function NoticeEdit() {
const BEUrl = process.env.REACT_APP_BACKEND_URL;

  const history = useHistory();
  const { id } = useParams();
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const getNotice = () => {
    axios({
      url: `${BEUrl}/api/v1/notice/${id}`,
      method: "get",
    })
      .then((res) => {
        setNewTitle(res.data.title);
        setNewContent(res.data.content);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  useEffect(getNotice, [BEUrl, id]);
  const handleNewTitle = (event) => {
    event.preventDefault();
    setNewTitle(event.target.value);
  };
  const handleNewContent = (event) => {
    event.preventDefault();
    setNewContent(event.target.value);
  };
  const setToken = () => {
    const token = localStorage.getItem("jwt");
    const config = {
      Authorization: `Bearer ${token}`,
    };
    return config;
  };
  const onEditNotice = (event) => {
    event.preventDefault();
    axios({
      url: `${BEUrl}/api/v1/notice/${id}`,
      method: "put",
      headers: setToken(),
      data: {
        title: newTitle,
        content: newContent,
      },
    })
      .then(() => {
        history.push(`/notice-detail/${id}`);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <div style={{ paddingTop: "100px" }}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography component="h1" variant="h4">
            공지사항 작성
          </Typography>
          <Box component="form" noValidate sx={{ mt: 1 }}>
            <TextField
              value={newTitle}
              onChange={handleNewTitle}
              variant="standard"
              margin="normal"
              required
              fullWidth
              label="제목"
              autoFocus
            />
            <TextField
              value={newContent}
              onChange={handleNewContent}
              variant="standard"
              margin="normal"
              required
              fullWidth
              multiline
              label="내용"
            />
            <MuiButton
              type="submit"
              onClick={onEditNotice}
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              수정하기
            </MuiButton>
          </Box>
        </Box>
      </Container>
    </div>
  );
}

export default NoticeEdit;
