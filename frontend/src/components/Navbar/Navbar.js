import React from 'react';
import Drawer from '@mui/material/Drawer';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { navbarStyles } from './styles';
import { mainMyPageItems, mainNavbarItems } from './consts/navbarListItems';
import { useNavigate } from "react-router-dom";

const Navbar = (title) => {
    const navigate = useNavigate();

    return(
        <React.Fragment>
        <Drawer
          sx={navbarStyles.drawer}
          variant="permanent"
          anchor="left">
        <Toolbar />
        <List>
            {mainMyPageItems.map((item, index) => (
                <ListItem button key={item.id} onClick={() => navigate(item.route)}>
                  <ListItemIcon sx={navbarStyles.icons}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    sx={navbarStyles.text} primary={item.label}/>
                </ListItem>
              ))}
        </List>

        <Divider />
        <List>
           {mainNavbarItems.map((item, index) => (
              <ListItem button key={item.id} onClick={() => navigate(item.route)}>
              <ListItemIcon sx={navbarStyles.icons}>
                {item.icon}
              </ListItemIcon>
              <ListItemText
                sx={navbarStyles.text} primary={item.label}/>
            </ListItem>
          ))}
        </List>
      </Drawer>
      </React.Fragment>
    )
}

export default Navbar;