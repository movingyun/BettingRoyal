import React from 'react'
import CommonButton from '../common/CommonButton/CommonButton'
import NotificationBell from '../common/NotificationBell/NotificationBell'
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
// import HelpIcon from '@mui/icons-material/Help';
import Box from '@mui/material/Box';

const Header = ({ title }) => {
    const headerStyles = {
        wrapper: {
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: '#2C3639',//'#DCD7C9', //'#A27B5C',//'#2C3639',//'#202425',
            padding: '10px',
        },
        topRow: {
            display: 'flex',
            flexDirection: 'row',
            justifyContent: '',
            alignItems: 'center',
            marginBottom: '10px',
            '*': {
                marginLeft: '10px',
            },
        },
    };
    
    return (
        <Box sx={headerStyles.wrapper}>
            <Box sx={headerStyles.topRow}>
                <Typography
                    variant="h1"
                    color="white">
                    {title}
                </Typography>
                {/* &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;
                &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;
                &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;
                &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp; */}
                <Tooltip title="Help">
                    <IconButton
                        color="white"
                        sx={headerStyles.helpIcon}>
                        {/* <HelpIcon /> */}
                    </IconButton>
                </Tooltip>
                {/* <NotificationBell
                    iconColor="white"/> */}
                {/* <Avatar src="https://cdn.pixabay.com/photo/2016/11/21/17/41/star-trails-1846734_960_720.jpg" /> */}
            </Box>
        </Box>
    )
}

export default Header