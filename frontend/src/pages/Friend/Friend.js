import React from "react";
import { useEffect, useState } from "react";
import { Grid, Box, Toolbar, Container, Paper } from "@mui/material";
import Nav from "react-bootstrap/Nav";
import { useLocation, Routes, Route } from "react-router-dom";
import FriendAccecp from "./FriendAccecp";
import FriendRequest from "./FriendRequest";
import FriendList from "./FriendList";
import { Navigate, useNavigate } from "react-router-dom";
import {makeStyles} from "@material-ui/core/styles";
import {createStyles} from "@material-ui/core";

const Friend = () => {

  const useStyles = makeStyles((theme) => createStyles({
    navItem: {
      fontFamily: "'Noto Sans KR', sans-serif",
      width: '33.333%',
      textAlign: 'center',
    },
    contents: {
      fontFamily: "'Noto Sans KR', sans-serif",
      marginTop: '20px',
    },
    navLink: {
      fontFamily: "'Noto Sans KR', sans-serif",
      fontWeight: '500',
      fontSize: 'large',
      color: '#A27B5C',
      '&:hover': {
        color: '#A27B5C',
      },
    },
    
  }));

  const styles = useStyles();
  const navigate = useNavigate();

  useEffect(() => {
    navigate("friendList");
  }, []);

  return (
    <div>
      <Nav variant="tabs" defaultActiveKey="link-0" className={styles.nav}>
        <Nav.Item className={styles.navItem}>
          <Nav.Link
            eventKey="link-0"
            onClick={() => navigate("friendList")}
            className={styles.navLink}
          >
            친구목록
          </Nav.Link>
        </Nav.Item>
        <Nav.Item className={styles.navItem}>
          <Nav.Link
            eventKey="link-1"
            onClick={() => navigate("FriendAccecp")}
            className={styles.navLink}
          >
            친구수락
          </Nav.Link>
        </Nav.Item>
        <Nav.Item className={styles.navItem}>
          <Nav.Link
            eventKey="link-2"
            onClick={() => navigate("friendRequest")}
            className={styles.navLink}
          >
            친구요청
          </Nav.Link>
        </Nav.Item>
      </Nav>
      {/* <Box
        component="main"
        sx={{
          flexGrow: 1,
          height: "100vh",
          overflow: "auto",
        }}
      > */}
        {/* <Container sx={{ mt: 4, mb: 4 }}> */}
          {/* <Header title={title} /> */}
          <Grid className={styles.contents}>
            <Grid item xs={12} md={12} lg={12}>
                <Routes>
                  <Route path="friendList" element={<FriendList />} />
                  <Route path="friendAccecp" element={<FriendAccecp />} />
                  <Route path="friendRequest" element={<FriendRequest />} />
                </Routes>
            </Grid>
          </Grid>
        {/* </Container> */}
      {/* </Box> */}
    </div>
  );
};

export default Friend;
