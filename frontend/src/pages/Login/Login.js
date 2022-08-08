import * as React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Avatar from "@mui/material/Avatar";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import styles from "./Login.module.css";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import Container from "@mui/material/Container";
import axios from "axios";
import { makeStyles } from "@material-ui/core/styles";

function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {"Copyright © "}
      <Link
        color="inherit"
        href="https://www.notion.so/image/https%3A%2F%2Fs3-us-west-2.amazonaws.com%2Fpublic.notion-static.com%2Fe7fac6ba-f892-47f4-9d4c-61a0d49c2699%2Fme.jpg?table=space&id=1454beab-817a-4a98-981c-cf89764cb3c7&width=60&userId=d83ef3f2-95c8-4a05-9da4-95cb8a2abdbc&cache=v2"
      >
        SungMini
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const theme = createTheme();

export default function SignInSide() {
  // const handleSubmit = (event) => {
  //   event.preventDefault();
  //   const data = new FormData(event.currentTarget);
  //   console.log({
  //     email: data.get('email'),
  //     password: data.get('password'),
  //   });
  // };

  const navigate = useNavigate();

  const [userId, setId] = useState("");
  const [pw, setPw] = useState("");
  const [loginResult, setLoginResult] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(userId, pw);
    setLoginResult("")
    axios
      .post("http://localhost:8080/api/auth/login", {
        userEmail: userId,
        userPw: pw,
      })
      .then(function (response) {
        console.log(JSON.stringify(response.data.accessToken));
        window.localStorage.setItem("accessToken", response.data.accessToken);

        //로비/공지사항 로 이동
        navigate("/lobby/notice");
      })
      .catch(function (error) {
        if (error.response.status == 401) {
          setLoginResult(<p className={styles.read}>아이디 혹은 비밀번호를 확인하세요.</p>)
        }
        console.log(error);
      });
  };

  return (
    <div className={styles.bg}>
      <div className={styles.tb}>
        <div className={styles.borderBox}>
          <Container component="main" maxWidth="xs">
            <Box>
              <div>
                <Link href="/" variant="body2">
                  <ArrowBackRoundedIcon fontSize="large" className={styles.ico} />
                </Link>
              </div>
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Avatar sx={{ mt: 5, bgcolor: "#2C3639", color: "#FFFFFF" }}>
                <PersonRoundedIcon />
              </Avatar>
              <p className={styles.title}>Login</p>
              <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      onChange={(e) => {
                        setId(e.target.value);
                      }}
                      color="action"
                      required
                      fullWidth
                      id="email"
                      label="이메일 아이디"
                      name="email"
                      autoComplete="email"
                      autoFocus
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      onChange={(e) => {
                        setPw(e.target.value);
                      }}
                      color="action"
                      required
                      fullWidth
                      name="password"
                      label="비밀번호"
                      type="password"
                      id="password"
                      autoComplete="current-password"
                    />
                    {/* <FormControlLabel 
                control={<Checkbox value="remember" color="primary" />}
                label="Remember me"
              /> */}
                  </Grid>
                </Grid>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <p>{loginResult}</p>
                  <button type="submit" className={styles.button}>
                    로그인
                  </button>
                </Box>
                <Grid container>
                  <Grid item xs>
                    <a href="#" variant="body2" className={styles.link}>
                      아이디·비밀번호 찾기
                    </a>
                  </Grid>
                  <Grid item>
                    <a href="signup" variant="body2" className={styles.link}>
                      {"회원가입"}
                    </a>
                  </Grid>
                </Grid>
              </Box>
            </Box>
            {/* <Copyright sx={{ mt: 5 }} /> */}
          </Container>
        </div>
      </div>
    </div>
  );
}
