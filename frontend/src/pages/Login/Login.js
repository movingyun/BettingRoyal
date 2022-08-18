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


const theme = createTheme();

export default function SignInSide(props) {
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
      .post("/api/auth/login", {
        userEmail: userId,
        userPw: pw,
      })
      .then(function (response) {
        console.log(JSON.stringify(response.data.accessToken));
        window.localStorage.setItem("accessToken", response.data.accessToken);

        //로비/공지사항 로 이동
        navigate("/lobby/rooms");
      })
      .catch(function (error) {
        if (error.response.status == 401) {
          setLoginResult("아이디 혹은 비밀번호를 확인하세요.")
        }
        console.log(error);
      });
  };

  return (
    <div className={styles.bg}>
      <div className={styles.tb}>
        <div className={styles.borderBox}>
          <Container component="main" maxWidth="xs">
              <Link href="/" variant="body2">
                <ArrowBackRoundedIcon fontSize="large" className={styles.ico} />
              </Link>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Avatar sx={{ mt: 4, bgcolor: "#2C3639", color: "#FFFFFF" }}>
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
                <p className={styles.read}>{loginResult}</p>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <button type="submit" className={styles.button}>
                    로그인
                  </button>
                </Box>
                <Grid container className={styles.botGrid}>
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
          </Container>
        </div>
      </div>
    </div>
  );
}
