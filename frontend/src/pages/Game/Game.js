import * as React from "react";
import Player from "./Player";
import { useEffect, useState } from "react";
import styles from "./Gameroom.module.css";
import ArrowForwardIosRoundedIcon from '@mui/icons-material/ArrowForwardIosRounded';
import card_am_1 from "../../images/cards/card_am_1.png";
import card_aq_1 from "../../images/cards/card_aq_1.png";
import card_back from "../../images/cards/card_back.png";

export default function Game(props) {

    const [players, setPlayers] = useState([]);
  
    let roomid=props.roomid;

    useEffect(() => {

    }, []);


    window.onload = function(){
        var card = document.getElementById('card');
        var sttBtn = document.getElementById('stt_btn');
        
        sttBtn.addEventListener('click', () => {
            console.log("ddd");
          card.classList.add('stt');
        });
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1><ArrowForwardIosRoundedIcon className={styles.icon}/>게임방 이름</h1>
                <h2>기본 베팅 10 루비</h2>
                <div className={styles.buttonList}>
                    <button className={styles.button}>관전자모드</button>
                    <button className={styles.button}>나가기</button>      
                </div>
            </div>
            <div className={styles.grid}>
                <div className={styles.center}>
                    <div className={styles.qs}>
                        누가 거짓말쟁이?
                    </div>
                    <div className={styles.cards}>
                        {/* 카드뒷면 */}
                        <div className={styles.cards_back}>
                            <img src={card_back} />
                            <img src={card_back} />
                        </div>
                        {/* 카드앞면오픈 */}
                        <div className={styles.cards_front}>
                            <img src={card_am_1} />
                            <img src={card_aq_1} />
                        </div>
                    </div>
                    <div className={styles.money}>
                        돈돈돈돈
                    </div>
                </div>

                <div className={styles.player1}>
                    <Player player={players[1]} />
                </div>
                <div className={styles.player2}>
                    <Player player={players[2]} />
                </div>
                <div className={styles.player3}>
                    <Player player={players[3]} />
                </div>
                <div className={styles.player4}>
                    <Player player={players[4]} />
                </div>
                <div className={styles.player5}>
                    <Player player={players[5]} />
                </div>
                <div className={styles.playerMe}>
                <Player player={players[0]}/>
                </div>

                {/* 게임시작버튼 */}
                <div className={styles.start}>
                    <button id="stt_btn" className="stt_btn">게임시작</button>
                </div>
                {/* 베팅버튼 */}
                {/* <div className={styles.betting}>
                    <button>다이</button>
                    <button>콜</button>
                    <button>레이즈</button>
                    <button>올인</button>
                </div> */}
                <div className={styles.rules}>
                트리플 &#62; 스트레이트 &#62; 더블 <br/>
                에메랄드 &#62; 다이아몬드 &#62; 아쿠아마린 &#62; 자수정
                </div>
            </div>
        </div>
    );
}
