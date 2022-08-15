
import React from 'react';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import {
  mainMyPageItems,
  mainNavbarItems,
  mainTutorialItems,
} from "./consts/navbarListItems";
import { useNavigate } from "react-router-dom";
import { navbarStyles } from "./styles";
import Modal from "../Modal/Modal";
import { useEffect, useState } from "react";
import ruby from "../../images/icon/ruby.png";
import Vault from '../../pages/modal/Vault/Vault'
import axios from "axios";
import { mainListItems, secondaryListItems } from './consts/listItems';
import { IconButton, Toolbar } from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';




const Navbar = (title) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [nickname, setNickname] = useState("");
  const [myruby, setMyRuby] = useState();
  
  const [open, setOpen] = useState(true);
    const toggleDrawer = () => {
      setOpen(!open);
    };

  const openModal = () => {
    setModalOpen(true);
  };
  const closeModal = () => {
    setModalOpen(false);
  };

  useEffect(() => {
    axios
    .get("/api/user", {
      headers : {
        Authorization: window.localStorage.accessToken,
          "Content-Type": "application/json",
      },
    })
    .then((response) => {
      console.log("user Info = " + JSON.stringify(response.data.userRuby))
      setNickname(response.data.userNickname);
      setMyRuby(response.data.userRuby);
    })
    .catch((error) => {
      console.log(error);
    });
  }, []);


  const [selectedIndex, setSelectedIndex] = useState(1);

  const handleListItemClick = (event, index) => {
    setSelectedIndex(index);

  };


  const navigate = useNavigate();

  function logout(){
    window.localStorage.removeItem("accessToken");
    alert("로그아웃 되었습니다.")
    navigate("/");
  }
  
    return(
        <Drawer
          sx={navbarStyles.drawer}
          variant="permanent"
          anchor="left">
        <List sx={navbarStyles.topList}>
          <Box sx={navbarStyles.topInfo}>
            <Box sx={navbarStyles.infoName}>
              {nickname}
            </Box>
            <Box sx={navbarStyles.infoRuby}>
              <img src={ruby} height="15" width="15"/> {myruby} 루비
            </Box>
          </Box>
          <Box sx={navbarStyles.topBtns}>
            {mainMyPageItems.map((item, index) => (
                <Button button key={item.id} onClick={() => navigate(item.route)} sx={navbarStyles.btn} >내정보</Button>
              ))}
                <Button onClick={ openModal } sx={navbarStyles.btn} >금고</Button>
                <Button onClick={ logout } sx={navbarStyles.btn} >로그아웃</Button>
              <Modal open={ modalOpen } close={ closeModal } header="루비금고">
               <Vault/>
          </Modal>
          </Box>
        </List>
        {/* <Divider sx={navbarStyles.divider}/> */}
        <List sx={navbarStyles.centerList}>
           {mainNavbarItems.map((item, index) => (
              <ListItem sx={navbarStyles.center} button key={item.id} onClick={() => navigate(item.route)}>
                  <ListItemIcon sx={navbarStyles.icons}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    sx={navbarStyles.centerText} primary={item.label}/>
            </ListItem>
          ))}
        </List>
        <List sx={navbarStyles.bottomList}>
        {/* <Divider sx={navbarStyles.divider}/> */}
           {mainTutorialItems.map((item, index) => (
              <ListItem sx={navbarStyles.bottom} button key={item.id} onClick={() => navigate(item.route)}>
              <ListItemText
                sx={navbarStyles.bottomText} primary={item.label}/>
            </ListItem>
          ))}
        </List>
      </Drawer>
    )
}


export default Navbar;
