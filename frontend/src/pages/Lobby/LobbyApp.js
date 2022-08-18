import React, { useState, useEffect } from "react";
// import Navbar from '../../components/Navbar/Navbar';
import { Outlet } from "react-router-dom";
import Grid from "@mui/material/Grid";
import { useLocation } from "react-router-dom";
import Header from "../../components/Header/Header";
import { styled, createTheme, ThemeProvider } from "@mui/material/styles";
import MuiAppBar from "@mui/material/AppBar";
import {
  Badge,
  CssBaseline,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  Paper,
  Toolbar,
  Typography,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import MuiDrawer from "@mui/material/Drawer";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { Box, Container } from "@mui/system";
import { mainListItems, secondaryListItems } from "../../components/Navbar/consts/listItems";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import { lobbyStyles } from "./styles";
import { Navigate, useNavigate } from "react-router-dom";
import axios from "axios";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { Routes, Route } from "react-router-dom";
import Mypage from "../Mypage/Mypage";
import Friend from "../Friend/Friend";
import NoticeList from "../Notice/NoticeList";
import BoardList from "../Board/BoardList";
import Ranking from "../Ranking/Ranking";
import Guild from "../Guild/Guild";
import Replay from "../Replay/Replay";
import Tutorial from "../Tutorial/Tutorial";
import { dashboardTheme } from "../../dashboardTheme";
import Rooms from "../Rooms/Rooms";
import Test from "../Test/Test";
import Review from "../Review/Review";
import NotificationBell from "../../components/common/NotificationBell/NotificationBell";
import rubyicon from "../../images/icon/ruby.png";
import logo from "../../images/logo/logo_horizontal.png";
import bg from "../../images/bg.jpg";
import Board from "../Board/Board";
import Notice from "../Notice/Notice";
import Button from "@mui/material/Button";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";

const drawerWidth = 240;

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== "open" })(
  ({ theme, open }) => ({
    "& .MuiDrawer-paper": {
      position: "relative",
      whiteSpace: "nowrap",
      width: drawerWidth,
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
      boxSizing: "border-box",
      ...(!open && {
        overflowX: "hidden",
        transition: theme.transitions.create("width", {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),
        width: theme.spacing(7),
        [theme.breakpoints.up("sm")]: {
          width: theme.spacing(9),
        },
      }),
    },
  })
);

const mdTheme = createTheme();

function NavbarContent(props) {
  const [title, setTitle] = useState(null);
  const [nickname, setNickname] = useState();
  const [ruby, setRuby] = useState(0);
  const location = useLocation();

  const navigate = useNavigate();

  const [open, setOpen] = useState(true);
  const toggleDrawer = () => {
    setOpen(!open);
  };

  useEffect(() => {
    let path = location.pathname.split("/");
    let parsedTitle = path[path.length - 1];
    setTitle(parsedTitle);

    axios
      .get("/api/user", {
        headers: {
          Authorization: window.localStorage.accessToken,
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        console.log("user Info = " + JSON.stringify(response.data.userRuby));
        setNickname(response.data.userNickname);
        setRuby(response.data.userRuby);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [location]);

  function logout() {
    window.localStorage.removeItem("accessToken");
    alert("로그아웃 되었습니다.");
    navigate("/");
  }

  return (
    <ThemeProvider>
      <Box sx={{ display: "flex" }}>
        <AppBar position="absolute" open={open} sx={lobbyStyles.abr}>
          <Toolbar
            sx={{
              pr: "24px", // keep right padding when drawer closed
            }}
          >
            <IconButton
              edge="start"
              color="inherit"
              aria-label="open drawer"
              onClick={toggleDrawer}
              sx={{
                marginRight: "36px",
                ...(open && { display: "none" }),
              }}
            >
              <MenuIcon />
            </IconButton>
            <Typography component="h1" variant="h6" color="inherit" noWrap sx={{ flexGrow: 1 }}>
              <img src={logo} height="28" />
            </Typography>
            <IconButton color="inherit">
              {/* <NotificationBell /> */}
              <Button onClick={logout} sx={lobbyStyles.logout}>
                <LogoutRoundedIcon sx={{ fontSize: 20, mr: 0.5 }} />
                로그아웃
              </Button>
            </IconButton>
          </Toolbar>
        </AppBar>

        <Drawer variant="permanent" sx={lobbyStyles.drawer} open={open}>
          <Toolbar
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              px: [1],
            }}
          >
            <IconButton onClick={toggleDrawer} sx={lobbyStyles.abr}>
              <ChevronLeftIcon />
            </IconButton>
          </Toolbar>

          <ListSubheader inset sx={lobbyStyles.topInfo}>
            <Box sx={lobbyStyles.infoName}>
              <b>{nickname}</b>&nbsp;님
            </Box>
            <Box sx={lobbyStyles.infoRuby}>
              <img src={rubyicon} height="15" width="15" />
              &nbsp;{ruby.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}&nbsp;루비
            </Box>
          </ListSubheader>
          <Box>
            {mainListItems.map((item, index) => (
              <ListItem
                sx={lobbyStyles.center}
                button
                key={item.id}
                onClick={() => navigate(item.route)}
              >
                <ListItemIcon sx={lobbyStyles.icons}>{item.icon}</ListItemIcon>
                <ListItemText primary={item.label} />
              </ListItem>
            ))}
          </Box>
          <Divider sx={lobbyStyles.divider} />
          <Box sx={lobbyStyles.bottomList}>
            <Divider sx={lobbyStyles.divider} />
            {secondaryListItems.map((item, index) => (
              <ListItem
                sx={lobbyStyles.bottom}
                button
                key={item.id}
                onClick={() => navigate(item.route)}
              >
                <ListItemIcon sx={lobbyStyles.icons}>{item.icon}</ListItemIcon>
                <ListItemText primary={item.label} />
              </ListItem>
            ))}
          </Box>
        </Drawer>
        <Box
          component="main"
          sx={{
            backgroundImage: `url(${bg})`,
            flexGrow: 1,
            height: "100vh",
            overflow: "auto",
          }}
        >
          <Toolbar />
          <Container sx={{ mt: 4, mb: 4 }}>
            {/* <Header title={title} /> */}
            <Grid container spacing={1}>
              <Grid item xs={12} md={12} lg={12}>
                <Paper
                  sx={{
                    p: 4,
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <Routes>
                    <Route path="rooms" element={<Rooms bgmState={props.bgmState} />} />
                    <Route path="mypage" element={<Mypage />} />
                    <Route path="notice/*" element={<Notice />} />
                    <Route path="board/*" element={<Board />} />
                    <Route path="friend/*" element={<Friend />} />
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

export default function LobbyApp(props) {
  return <NavbarContent bgmState={props.bgmState} />;
}
