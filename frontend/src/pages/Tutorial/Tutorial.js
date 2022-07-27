import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

function TabPanel(props) {
    const { children, value, index, ...other } = props;
  
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && (
          <div>
            {children}
          </div>
        )}
      </div>
    );
  }
  
  TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired,
  };
  
  function a11yProps(index) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
  }
  
  const useStyles = makeStyles((theme) => ({
    root: {
      flexGrow: 1,
      backgroundColor: theme.palette.background.paper,
    },
  }));
  
  export default function Tutorial() {
    const classes = useStyles();
    const [value, setValue] = React.useState(0);
  
    const handleChange = (event, newValue) => {
      setValue(newValue);
    };
  
    return (
      <div className={classes.root} style={{marginLeft: '250px'}}>
        <AppBar position="static">
          <Tabs value={value} onChange={handleChange} aria-label="simple tabs example">
            <Tab label="게임룰" {...a11yProps(0)} />
            <Tab label="족보" {...a11yProps(1)} />
            <Tab label="베팅방법" {...a11yProps(2)} />
            <Tab label="게임방 사용법" {...a11yProps(3)} />
          </Tabs>
        </AppBar>
        <TabPanel value={value} index={0}>
            <p>멘탈리스트(가제)는 플레이어들에게 공유되는 2장의 공유 카드와 개인 카드 1장, 총 3장을 조합해서 누가 더 높은 족보인지를 겨루는 게임입니다.</p>
            <p>2장의 공유 카드는 게임에 참여한 모든 플레이어들이 볼수 있습니다.<br/> 1장의 개인 카드는 나를 제외한 모든 플레이어가 볼수 있지만, 나 자신은 내 카드가 무엇인지 볼 수 없습니다. </p>
            <p>카드는 1부터 10까지의 스페이드, 다이아, 하트, 클로버 네 가지 모양이 사용됩니다.</p>
            <p>플레이어는 공유카드 2장과 상대의 카드를 단서로 배팅을 할수 있으며, 공통 질문시간을 통해 서로 대화를 나누며 상대의 표정과 목소리로 심리를 읽어 플레이에 도움을 받을 수 있습니다.</p>
        </TabPanel>
        <TabPanel value={value} index={1}>
            <h3>더블</h3>
            <p>자신의 카드와 공유카드 중 1장이 같은 숫자일 경우</p>
            <h3>스트레이트</h3>
            <p>공유카드 2장과 자신의 카드까지 3장이 연속되는 숫자를 이룰 경우</p>
            <h3>트리플</h3>
            <p>공유카드 2장과 자신의 카드 3장이 모두 같은 숫자인 경우</p>
          
            <p>공유카드와 아무런 조합이 없을 경우 높은숫자의 카드가 승리합니다.<br/>
                숫자가 동일할 경우 스페이드 > 다이아 > 하트 > 클로버 순으로 높습니다.<br/>
                카드는 매 판 리셋됩니다.</p>
        </TabPanel>
        <TabPanel value={value} index={2}>
            <p>모든 방에는 최소 베팅 루비가 있습니다.<br/>
            플레이어가 가지는 루비에는 제한이 없습니다.
            </p>
            <h3>다이</h3>
            <p>베팅한 루비를 포기하고 해당판에서 기권</p>
            <h3>콜</h3>
            <p>앞사람이 베팅한 루비와 동일하게 베팅</p>
            <h3>레이즈</h3>
            <p>앞사람이 베팅한 루비보다 더 많은 루비를 베팅</p>
            <h3>올인</h3>
            <p>가지고 있는 루비를 전부 베팅</p>
        </TabPanel>
        <TabPanel value={value} index={3}>
        <p>모든 플레이어는 카메라와 마이크를 켜고 플레이에 참여해야 합니다.</p>
        </TabPanel>
      </div>
    );
  }

// const Tutorial = () => {
//     return (
//         <div style={{marginLeft: '250px'}}>
//             This is Tutorial page.
//         </div>
//     )
// }

// export default Tutorial