import React from 'react'
import Badge from '@mui/material/Badge';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import IconButton from '@mui/material/IconButton';
import Tooltip from  '@mui/material/Tooltip';
import BasicMenu from '../BasicMenu/BasicMenu';
import { useNavigate } from "react-router-dom";

const notifications = [
    {
        id: 0,
        label: '내 정보'
    },
    {
        id: 1,
        label: '로그아웃'
    },
]; 

const NotificationBell = ( {iconColor } ) => {
    const [open, setOpen] = React.useState(false);
    const [anchorEl, setAnchorEl] = React.useState(null);
    // const newNotifications = `You have ${notifications.length} new notifications!`;
    const newNotifications = `내 정보를 확인하세요!`;
    const noNotifications = 'No new notifications';

    const handleOpen = (event) => {
        setAnchorEl(event.currentTarget)
        setOpen(true);
    };
    
    const handleClose = () => {
        setOpen(false);
    };

    const navigate = useNavigate();

    function logout(){
        window.localStorage.removeItem("accessToken");
        alert("로그아웃 되었습니다.")
        navigate("/");
    }

    return (
        <div>
        <Tooltip title={notifications.length ? newNotifications : noNotifications}>
        <IconButton
            color={'inherit'}
            onClick={notifications.length ? handleOpen : null}
            anchorEl={anchorEl}>
            <Badge badgeContent={notifications.length} color="error">
                <AccountCircleIcon />
            </Badge>
        </IconButton>
        </Tooltip>
        <BasicMenu 
            open={open} 
            anchorEl={anchorEl} 
            handleClose={handleClose}
            menuItems={notifications}/>
        </div>
    )
}

export default NotificationBell