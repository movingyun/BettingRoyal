import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import styles from "./Login.module.css";
// import { ArrowBackRoundedIcon } from '@material-ui/icons';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import Container from '@mui/material/Container';

function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="https://www.notion.so/image/https%3A%2F%2Fs3-us-west-2.amazonaws.com%2Fpublic.notion-static.com%2Fe7fac6ba-f892-47f4-9d4c-61a0d49c2699%2Fme.jpg?table=space&id=1454beab-817a-4a98-981c-cf89764cb3c7&width=60&userId=d83ef3f2-95c8-4a05-9da4-95cb8a2abdbc&cache=v2">
        SungMini
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const theme = createTheme();

export default function SignInSide() {
  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    console.log({
      email: data.get('email'),
      password: data.get('password'),
    });
  };


return (
  <ThemeProvider theme={theme}>
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box marginTop={10}><div><Link href="/" variant="body2">
          <ArrowBackRoundedIcon fontSize="large" className={styles.ico} />
        </Link></div></Box>
      
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        
        <Avatar sx={{ m: 1, bgcolor: '#000000' }}>
          <PersonRoundedIcon/>
        </Avatar>
        <Typography component="h1" variant="h5">
          로그인
        </Typography>
        <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            
          <Grid item xs={12}>
               <TextField
              color="secondary"
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
              color="secondary"
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
          <Box sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          }}>
             <button type="submit" className={styles.button}>
            로그인
            </button>
          </Box>

          <Grid container>
                 <Grid item xs>
                   <Link href="#" variant="body2" className={styles.li}>
                   아이디·비밀번호 찾기
                   </Link>
                 </Grid>
                 <Grid item>
                   <Link href="signup" variant="body2" className={styles.li}>
                     {"회원가입"}
                   </Link>
                 </Grid>
               </Grid>
        </Box>
      </Box>
      <Copyright sx={{ mt: 5 }} />
    </Container>
  </ThemeProvider>
);
}