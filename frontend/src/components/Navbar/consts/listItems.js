import * as React from 'react';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import PersonAddRoundedIcon from '@mui/icons-material/PersonAddRounded';
import GroupsRoundedIcon from '@mui/icons-material/GroupRounded';
import MilitaryTechRoundedIcon from '@mui/icons-material/MilitaryTechRounded';
import ChatRoundedIcon from '@mui/icons-material/ChatRounded';
import AssignmentIcon from '@mui/icons-material/Assignment';
import BugReportIcon from '@mui/icons-material/BugReport';
import HelpRoundedIcon from '@mui/icons-material/HelpRounded';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

export const mainListItems = [

{
  id:0,
  icon:<HomeRoundedIcon/>,
  label: '홈',
  route: 'rooms',
},
{
  id:1,
  icon:<AccountCircleIcon/>,
  label: '내 정보',
  route: 'mypage',
},
{
  id:2,
  icon:<AssignmentIcon />,
  label: '공지사항',
  route: 'notice',
},
{
  id:3,
  icon:<MilitaryTechRoundedIcon/>,
  label: '랭킹',
  route: 'ranking',
},
{
  id:4,
  icon:<PersonAddRoundedIcon/>,
  label: '친구목록',
  route: 'friend',
},
// {
//   id:5,
//   icon:<GroupsRoundedIcon/>,
//   label: '길드',
//   route: 'guild',
// },
{
  id:5,
  icon:<ChatRoundedIcon />,
  label: '게시판',
  route: 'board',
},

]

export const secondaryListItems = 
[

  {
    id:0,
    icon:<BugReportIcon />,
    label: '환경테스트',
    route: 'test',
},
{
    id:1,
    icon:<HelpRoundedIcon />,
    label: '도움말',
    route: 'tutorial',
},
// {
//   id:2,
//   icon:<HelpRoundedIcon />,
//   label: '리뷰',
//   route: 'review',
// },


]