import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar/Navbar';
import { Outlet } from "react-router-dom";
import Grid from '@mui/material/Grid';
import { useLocation } from 'react-router-dom'; 
import Header from '../../components/Header/Header';
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
import MuiAppBar from '@mui/material/AppBar';
import { Badge, CssBaseline, Divider, IconButton, List, ListItem, ListItemIcon, ListItemText, ListSubheader, Paper, Toolbar, Typography } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import MuiDrawer from '@mui/material/Drawer';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { Box, Container } from '@mui/system';
import { mainListItems, secondaryListItems } from '../../components/Navbar/consts/listItems';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import { lobbyStyles } from "../../styles";
import { Navigate, useNavigate } from "react-router-dom";
import axios from "axios";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

import { Routes, Route} from "react-router-dom";
import Mypage from "../Mypage/Mypage";
import Friend from "../Friend/Friend";
import Notice from "../Notice/Notice";
import Ranking from "../Ranking/Ranking";
import Guild from "../Guild/Guild";
import Replay from "../Replay/Replay";
import Tutorial from "../Tutorial/Tutorial";
import { dashboardTheme } from "../../dashboardTheme";
import Rooms from "../Rooms/Rooms";
import Test from "../Test/Test";
import Review from "../Review/Review";
import NotificationBell from '../../components/common/NotificationBell/NotificationBell';
import rubyicon from "../../images/icon/ruby.png";


const drawerWidth = 240;

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,

  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));


const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    '& .MuiDrawer-paper': {
      position: 'relative',
      whiteSpace: 'nowrap',
      width: drawerWidth,
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
      boxSizing: 'border-box',
      ...(!open && {
        overflowX: 'hidden',
        transition: theme.transitions.create('width', {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),
        width: theme.spacing(7),
        [theme.breakpoints.up('sm')]: {
          width: theme.spacing(9),
        },
      }),
    },
  }),
);


const mdTheme = createTheme();


function NavbarContent() {
  const [title, setTitle] = useState(null);
  const [nickname, setNickname] = useState();
  const [ruby, setRuby] = useState();
  const location = useLocation();

  const navigate = useNavigate();

  const [open, setOpen] = useState(true);
    const toggleDrawer = () => {
      setOpen(!open);
    };

    useEffect(() => {
      let path = location.pathname.split("/");
      let parsedTitle = path[path.length-1];
      setTitle(parsedTitle);

      axios
      .get("http://localhost:8080/api/user", {
        headers : {
          Authorization: window.localStorage.accessToken,
            "Content-Type": "application/json",
        },
      })
      .then((response) => {
        console.log("user Info = " + JSON.stringify(response.data.userRuby))
        setNickname(response.data.userNickname);
        setRuby(response.data.userRuby);
      })
      .catch((error) => {
        console.log(error);
      });
    }, [location]);
  

  return (
   <ThemeProvider >
    <Box sx={{ display: 'flex' }}>
    <CssBaseline />

    <AppBar position="absolute" open={open} sx={lobbyStyles.abr}>
          <Toolbar
            sx={{
              pr: '24px', // keep right padding when drawer closed
            }}
          >
            <IconButton
              edge="start"
              color="inherit"
              aria-label="open drawer"
              onClick={toggleDrawer}
              sx={{
                marginRight: '36px',
                ...(open && { display: 'none' }),
              }}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              component="h1"
              variant="h6"
              color="inherit"
              noWrap
              sx={{ flexGrow: 1 }}
            >
              Betting Royal
            </Typography>
            <IconButton color="inherit">
              {/* <Badge badgeContent={4} color="secondary"> */}
                {/* <AccountCircleIcon /> */}
                <NotificationBell />
              {/* </Badge> */}
            </IconButton>
          </Toolbar>
        </AppBar>


        <Drawer variant="permanent" sx={lobbyStyles.drawer} open={open}>
          <Toolbar
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              px: [1],
            }}
          >
            <IconButton onClick={toggleDrawer} sx={lobbyStyles.abr}>
              <ChevronLeftIcon />
            </IconButton>
          </Toolbar>

            <ListSubheader inset sx={lobbyStyles.bottomText}>{nickname} 님 😊
            <Box>
            <img src={rubyicon} height="15" width="15"/>&nbsp;&nbsp;
               {ruby} 루비
            </Box></ListSubheader>
            
          <List component="nav">
            <Divider sx={{ my: 1 }} />    
            {/* <ListSubheader  inset sx={lobbyStyles.abr}>
      ⬛◻⬛◻⬛◻⬛
          </ListSubheader>      */}
            {mainListItems.map((item, index) => (
              <ListItem sx={lobbyStyles.center} button key={item.id} onClick={() => navigate(item.route)}>
                <ListItemIcon sx={lobbyStyles.icons}>
                  {item.icon}  
                </ListItemIcon> 
                <ListItemText primary={item.label}/>
              </ListItem>
            ))}
            <ListSubheader component="div" inset sx={lobbyStyles.abr}>
            ◻⬛◻⬛◻⬛◻
          </ListSubheader>
          <Divider sx={{ my: 1 }} />  
            {secondaryListItems.map((item, index) => (
              <ListItem sx={lobbyStyles.center} button key={item.id} onClick={() => navigate(item.route)}>
                <ListItemIcon sx={lobbyStyles.icons} >
                  {item.icon}  
                </ListItemIcon> 
                <ListItemText primary={item.label}/>
              </ListItem>
            ))}
          </List>

        </Drawer>
        <Box
          component="main" 
          sx={{
            backgroundColor: (theme) =>
              theme.palette.mode === 'light'
                ? theme.palette.grey[300]
                : theme.palette.grey[900],
                flexGrow: 1,
                height: '100vh',
                overflow: 'auto',
              }}>
          <Toolbar />
          <Container sx={{ mt: 4, mb: 4 }}>
                <Header title={title} />
          <Grid container spacing={1}>
              <Grid item xs={12} md={12} lg={12}>
                <Paper
                  sx={{
                    p: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    height: 800,
                  }} >
                    {/* ///////////////////////////////////////// */}
                  <Routes>
                  <Route path="rooms" element={<Rooms />} />
                  <Route path="mypage" element={<Mypage />} />
                  <Route path="notice" element={<Notice />} />
                  <Route path="friend" element={<Friend />} />
                  <Route path="ranking" element={<Ranking />} />
                  <Route path="guild" element={<Guild />} />
                  <Route path="replay" element={<Replay />} />
                  <Route path="tutorial" element={<Tutorial />} />
                  <Route path="test" element={<Test />} />
                  <Route path="review" element={<Review />} />
                </Routes>
                </Paper>
              </Grid>
            </Grid>
          </Container>
        </Box>
    </Box>
    </ThemeProvider>
  );
}

export default function LobbyApp() {
  return <NavbarContent />;
};