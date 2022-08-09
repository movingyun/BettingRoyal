/* eslint-disable */
import { useState } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";
import {
  Container,
  CssBaseline,
  Box,
  Typography,
  TextField,
  Button as MuiButton,
} from "@mui/material";

function NoticeForm() {
	const BEUrl = process.env.REACT_APP_BACKEND_URL;

  const history = useHistory();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const handleTitle = (event) => {
    event.preventDefault();
    setTitle(event.target.value);
  };
  const handleContent = (event) => {
    event.preventDefault();
    setContent(event.target.value);
  };
  const setToken = () => {
    const token = localStorage.getItem("jwt");
    const config = {
      Authorization: `Bearer ${token}`,
    };
    return config;
  };
  const onCreateNotice = (event) => {
    event.preventDefault();
    axios({
      url: `${BEUrl}/api/v1/notice`,
      method: "post",
      headers: setToken(),
      data: {
        title: title,
        content: content,
      },
    })
      .then(() => {
        history.push("/notice");
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
              value={title}
              onChange={handleTitle}
              variant="standard"
              margin="normal"
              required
              fullWidth
              label="제목"
              autoFocus
            />
            <TextField
              value={content}
              onChange={handleContent}
              variant="standard"
              margin="normal"
              required
              fullWidth
              multiline
              label="내용"
            />
            <MuiButton
              type="submit"
              onClick={onCreateNotice}
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              작성하기
            </MuiButton>
          </Box>
        </Box>
      </Container>
    </div>
  );
}

export default NoticeForm;
