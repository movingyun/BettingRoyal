import * as React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
// import axios from "axios";
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import styles from "./Signup.module.css";
import Select, { SelectChangeEvent } from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import axios from "axios"

const gender = [
  {
    value: 'M',
    label: '남성',
  },
  {
    value: 'F',
    label: '여성',
  },
];

function Copyright(props) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      <Link
        color="inherit"
        href="https://www.notion.so/image/https%3A%2F%2Fs3-us-west-2.amazonaws.com%2Fpublic.notion-static.com%2Fe7fac6ba-f892-47f4-9d4c-61a0d49c2699%2Fme.jpg?table=space&id=1454beab-817a-4a98-981c-cf89764cb3c7&width=60&userId=d83ef3f2-95c8-4a05-9da4-95cb8a2abdbc&cache=v2"
      >
        Sungmini
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
      <br />
    </Typography>
  );
}

const theme = createTheme();

export default function SignUp() {
  const navigate = useNavigate();

  const [NickName, setNickName] = useState("");
  const [Email, setEmail] = useState("");
  // const [Gender, setGender] = useState("");
  const [Password, setPassword] = useState("");
  const [ConfirmPassword, setConfirmPassword] = useState("");
  const [ErrorMsgPassword, setErrorMsgPassword] = useState("");
  const [emailcheck, setEmailcheck] = useState("");
  const [pwcheck, setPwcheck] = useState("");
  const [nickcheck, setNickcheck] = useState("");

  const onNickNameHandler = (event) => {
    setNickName(event.currentTarget.value);
  };

  const onEmailHandler = (event) => {
    setEmail(event.currentTarget.value);
  };

  const onGenderHandler = (event) => {
    setGender(event.currentTarget.value);
  };

  const onPasswordHandler = (event) => {
    setPassword(event.currentTarget.value);
  };

  const onConfirmPasswordHandler = (event) => {
    setConfirmPassword(event.currentTarget.value);
    if (event.currentTarget.value !== Password)
      setErrorMsgPassword("비밀번호를 확인해주세요.");
    else setErrorMsgPassword("");
  };

  const [Gender, setGender] = React.useState('EUR');

  const handleChange = (event) => {
    setGender(event.target.value);
  };


  async function  onSubmitHandler(event){
    event.preventDefault();
    const userInfo = {
      userNickname: NickName,
      userEmail: Email,
      userGender: Gender,
      userPw: Password,
      ConfirmPassword: ConfirmPassword,
    };

    const data = new FormData(event.currentTarget);
    /*console.log({
      email: data.get("email"),
      password: data.get("password"),
    });*/

    var hasEmptyInfo = false;
    for (var i in userInfo) {
      if (!userInfo[i]) {
        hasEmptyInfo = true;
      }
    }

    setEmailcheck('')
    setPwcheck('')
    setNickcheck('')
    let emailRegex=new RegExp("[a-zA-z0-9]+@[a-zA-z]+[.]+[a-zA-z.]+")
    let pwRegex = new RegExp("^(?=.*[A-Za-z])(?=.*\\d)(?=.*[~?!@#$%^&*()+|=])[A-Za-z\\d~?!@#$%^&*()+|=]{8,}$")
    let nicknameRegex= new RegExp("^[0-9a-zA-Z가-힣]*$")
    let checkcount=0;
    if(!emailRegex.test(Email)) {
      setEmailcheck(<p className={styles.read}>이메일 형식이 아닙니다. </p>)
      
    }else checkcount++;
    if(!pwRegex.test(Password)) {
      setPwcheck(<p className={styles.read}>비밀번호는 영문/숫자/특수문자 각 1자 이상 포함하여 최소 8자여야 합니다.</p>)
      
    }else checkcount++;
    if(!nicknameRegex.test(NickName)) {
      setNickcheck(<p className={styles.read}>닉네임은 한글/숫자/영어만 가능합니다.</p>)
      
    }else if(NickName<2 || NickName >8) {
      setNickcheck( <p className={styles.read}>닉네임은 2자 이상 8자 이하만 가능합니다.</p>)
    
    }else checkcount++;
    if(checkcount!=3) return;


    if (hasEmptyInfo) {
      alert("모든 항목을 다 입력하세요.");
    }
    else if(Password != ConfirmPassword){
      alert("비밀번호가 일치하지 않습니다")
    } 
    else {
      // const statusCode = await createUserFetch();
      console.log('sending '+JSON.stringify(userInfo))
      await axios
      .post("http://localhost:8080/api/auth/signup", {
        userEmail: userInfo.userEmail,
        userGender: userInfo.userGender,
        userNickname: userInfo.userNickname,
        userPw:userInfo.userPw
      })
      .then(function (response) {
        console.log(JSON.stringify(response.data.statusCode));
        // return JSON.stringify(response.data.statusCode);
        if (response.data.statusCode == 200) {
          alert("회원가입 성공");
          navigate("/");
        } else {
          console.log(response.data.statusCode);
          alert("회원가입 실패");
        }
      })
      .catch(function (error) {
        console.log(error);
        return error;
      });


      // // alert("로그인 성공");
      // if (statusCode == "200") {
      //   console.log("회원가입 성공");
      //   navigate("/");
      // } else {
      //   console.log(statusCode);
      //   alert("ㄴㄴ");
      // }
    }
  }
  // async const onSubmitHandler = (event) => {
  //   event.preventDefault();

  //   const userInfo = {
  //     NickName: NickName,
  //     Email: Email,
  //     Nation: Nation,
  //     Password: Password,
  //     ConfirmPassword: ConfirmPassword,
  //   };

  //   const data = new FormData(event.currentTarget);
  //   console.log({
  //     email: data.get("email"),
  //     password: data.get("password"),
  //   });

  //   var hasEmptyInfo = false;
  //   for (var i in userInfo) {
  //     if (!userInfo[i]) {
  //       hasEmptyInfo = true;
  //     }
  //   }

  //   if (hasEmptyInfo) {
  //     alert("모든 항목을 다 입력하세요.");
  //   } else {
  //     const statusCode = await createUserFetch();

  //     // alert("로그인 성공");
  //     if (statusCode == "200") {
  //       console.log("회원가입 성공");
  //       navigate("/");
  //     } else {
  //       console.log(statusCode);
  //       alert("ㄴㄴ");
  //     }
  //   }
  //   //
  // };
/*
  async function createUserFetch(userInfo) {
    // var config = {
    //   method: "post",
    //   url: "",
    // };
    console.log(Email, Password);
    await axios
      .post("http://localhost:8080/api/v1/users", {
        id: Email,
        password: Password,
      })
      .then(function (response) {
        console.log(JSON.stringify(response.data.statusCode));
        return JSON.stringify(response.data.statusCode);
      })
      .catch(function (error) {
        console.log(error);
        return error;
      });
  }
*/
  return (
    <div className={styles.bg}>
    <div className={styles.tb}>
    <div className={styles.borderBox}>
      <Container component="main" maxWidth="xs">
        <Box>
          <div><Link href="/" variant="body2">
          <ArrowBackRoundedIcon fontSize="large" className={styles.ico} />
        </Link></div>
        </Box>
        <Box
          sx={{ 
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          {/* <Avatar sx={{ m: 1, bgcolor: '#2C3639' }}>
            <PersonRoundedIcon/>
          </Avatar> */}
          <p className={styles.title}>
            Sign Up
          </p>
          <Box
            component="form"
            noValidate
            onSubmit={onSubmitHandler}
            sx={{ mt: 3 }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                color="action"
                  autoComplete="email"
                  name="email"
                  required
                  fullWidth
                  id="email"
                  label="이메일 아이디"
                  onChange={onEmailHandler}
                />
                <p>{emailcheck}</p>
              </Grid>
              <Grid item xs={12}>
                <TextField
                color="action"
                  required
                  fullWidth
                  name="password"
                  label="비밀번호"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                  onChange={onPasswordHandler}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                color="action"
                  required
                  fullWidth
                  name="confirmpassword"
                  label="비밀번호 확인"
                  type="password"
                  id="confirmPassword"
                  autoComplete="new-password"
                  onChange={onConfirmPasswordHandler}
                />
                <p>{pwcheck}</p>
              </Grid>
              <Grid item xs={12}>
                <TextField
                color="action"
                  autoComplete="given-name"
                  name="nickName"
                  required
                  fullWidth
                  id="nickName"
                  label="닉네임"
                  onChange={onNickNameHandler}
                  autoFocus
                />
                <p>{nickcheck}</p>
              </Grid>

              <Grid item xs={12}>
                <TextField
                required
                color="action"
                fullWidth
                  id="gender"
                  select
                  label="성별"
                  value={Gender}
                  onChange={handleChange}
                >
                  {gender.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>


              {/* <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Checkbox value="allowExtraEmails" color="primary" />
                  }
                  label="마케팅 동의"
                />
              </Grid> */}
            </Grid>
            <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            }}>
               <button type="submit"  className={styles.button}>
              회원가입
              </button>
            </Box>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <a href="login" variant="body2" className={styles.link}>
                  로그인
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
