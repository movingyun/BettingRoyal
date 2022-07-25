import EmojiPeopleRoundedIcon from '@mui/icons-material/EmojiPeopleRounded';
import AnnouncementRoundedIcon from '@mui/icons-material/AnnouncementRounded';
import SportsKabaddiRoundedIcon from '@mui/icons-material/SportsKabaddiRounded';
import SupervisorAccountRoundedIcon from '@mui/icons-material/SupervisorAccountRounded';
import OndemandVideoRoundedIcon from '@mui/icons-material/OndemandVideoRounded';
import StarRoundedIcon from '@mui/icons-material/StarRounded';


export const mainMyPageItems = [
    {
        id:0,
        icon:'',
        label: 'My Page',
        route: 'mypage',
    },
]

export const mainNavbarItems = [
    {
        id:0,
        icon:<AnnouncementRoundedIcon />,
        label: 'Notice',
        route: 'notice',
    },
    {
        id:1,
        icon:<EmojiPeopleRoundedIcon/>,
        label: 'Friend',
        route: 'friend',
    },
    {
        id:2,
        icon:<SportsKabaddiRoundedIcon/>,
        label: 'Ranking',
        route: 'ranking',
    },
    {
        id:3,
        icon:<SupervisorAccountRoundedIcon/>,
        label: 'Guild',
        route: 'guild',
    },
    {
        id:4,
        icon:<OndemandVideoRoundedIcon/>,
        label: 'Replay',
        route: 'replay',
    },
    {
        id:5,
        icon:<StarRoundedIcon/>,
        label: 'Tutorial',
        route: 'tutorial',
    },{
        id:6,
        icon:<StarRoundedIcon/>,
        label: 'Rooms',
        route: 'rooms',
    },
]