import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import PersonAddRoundedIcon from '@mui/icons-material/PersonAddRounded';
import GroupsRoundedIcon from '@mui/icons-material/GroupRounded';
import ReplayRoundedIcon from '@mui/icons-material/ReplayRounded';
import MilitaryTechRoundedIcon from '@mui/icons-material/MilitaryTechRounded';
import ChatRoundedIcon from '@mui/icons-material/ChatRounded';

export const mainMyPageItems = [
    {
        id:0,
        icon:'',
        label: '내 정보',
        route: 'mypage',
    },
]

export const mainNavbarItems = [
    {
        id:0,
        icon:<HomeRoundedIcon/>,
        label: '홈',
        route: 'rooms',
    },
    {
        id:1,
        icon:<ChatRoundedIcon />,
        label: '공지사항',
        route: 'notice',
    },
    {
        id:2,
        icon:<MilitaryTechRoundedIcon/>,
        label: '랭킹',
        route: 'ranking',
    },
    {
        id:3,
        icon:<PersonAddRoundedIcon/>,
        label: '친구목록',
        route: 'friend',
    },
    {
        id:4,
        icon:<GroupsRoundedIcon/>,
        label: '길드',
        route: 'guild',
    },
    {
        id:5,
        icon:'',
        label: 'sss',
        route: 'review',
    },

]

export const mainTutorialItems = [
    {
        id:0,
        icon:'',
        label: '환경테스트',
        route: 'test',
    },
    {
        id:1,
        icon:'',
        label: '도움말',
        route: 'tutorial',
    },
]