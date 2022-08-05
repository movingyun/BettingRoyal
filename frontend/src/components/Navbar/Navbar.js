import React from 'react';
import Drawer from '@mui/material/Drawer';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { mainMyPageItems, mainNavbarItems, mainTutorialItems} from './consts/navbarListItems';
import { useNavigate } from "react-router-dom";
import { navbarStyles } from './styles';
import Modal from "../Modal/Modal";
import { useEffect, useState } from "react";
import ruby from "../../images/icon/ruby.png";

const Navbar = (title) => {

  const [modalOpen, setModalOpen] = useState(false);

  const openModal = () => {
    setModalOpen(true);
  };
  const closeModal = () => {
    setModalOpen(false);
  };

  useEffect(() => {}, []);
  const [selectedIndex, setSelectedIndex] = useState(1);

  const handleListItemClick = (event, index) => {
    setSelectedIndex(index);
  };
  
    const navigate = useNavigate();

    return(
        <Drawer
          sx={navbarStyles.drawer}
          variant="permanent"
          anchor="left">
        <List sx={navbarStyles.topList}>
          <Box sx={navbarStyles.topInfo}>
            <Box sx={navbarStyles.infoName}>
              닉네임
            </Box>
            <Box sx={navbarStyles.infoRuby}>
              <img src={ruby} height="15" width="15"/> 100000 루비
            </Box>
          </Box>
          <Box sx={navbarStyles.topBtns}>
            {mainMyPageItems.map((item, index) => (
                <Button button key={item.id} onClick={() => navigate(item.route)} sx={navbarStyles.btn} >내정보</Button>
              ))}
                <Button onClick={ openModal } sx={navbarStyles.btn} >금고</Button>
              <Modal open={ modalOpen } close={ closeModal } header="루비금고">
            <button>입금</button>
            <button>출금</button>
          </Modal>
          </Box>
        </List>
        <Divider sx={navbarStyles.divider}/>
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