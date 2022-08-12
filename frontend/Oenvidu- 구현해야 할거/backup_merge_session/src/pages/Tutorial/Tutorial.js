import Nav from 'react-bootstrap/Nav';
import React, { useEffect, useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from "./Tutorial.module.css";

function TabContent(props){
  if(props.clicked === 0){
    return <div className={styles.contents}>
      <p>베팅로얄은 플레이어들에게 공유되는 2장의 공유 카드와 개인 카드 1장, 총 3장을 조합해서 누가 더 높은 족보인지를 겨루는 게임입니다.</p>
      <p>2장의 공유 카드는 게임에 참여한 모든 플레이어가 볼 수 있습니다.<br/>
      1장의 개인 카드는 나를 제외한 모든 플레이어가 볼 수 있지만, 나 자신은 내 카드가 무엇인지 볼 수 없습니다.</p>
      <p>카드는 1부터 10까지의 자수정, 아쿠아마린, 다이아몬드, 에메랄드 네 가지 모양이 사용됩니다.</p>
      <p>플레이어는 공유 카드 2장과 상대의 카드를 단서로 배팅을 할 수 있으며, 공통 질문 시간을 통해 서로 대화를 나눌 수 있습니다.<br/> 
      화면 속에서 보여지는 표정과 목소리로 상대의 심리를 읽어 베팅에 성공하면 승리합니다.</p>
    </div>
  }else if(props.clicked === 1) {
    return <div className={styles.contents}>
      <h3>더블</h3>
      <p>자신의 카드와 공유 카드 중 1장이 같은 숫자일 경우</p>
      <h3>스트레이트</h3>
      <p>공유 카드 2장과 자신의 카드까지 3장이 연속되는 숫자를 이룰 경우</p>
      <h3>트리플</h3>
      <p>공유 카드 2장과 자신의 카드 3장이 모두 같은 숫자인 경우</p>
      <p>공유 카드와 아무런 조합이 없으면 높은 숫자의 카드가 승리합니다.<br/>
      숫자가 같을 경우 자수정 &#60; 아쿠아마린 &#60; 다이아몬드 &#60; 에메랄드 순으로 높습니다.<br/>
      카드는 매 판 리셋됩니다.</p>
    </div>
  }else if(props.clicked === 2){
    return <div className={styles.contents}>
      <p>모든 방에는 최소 베팅 루비가 있습니다.<br/>
      플레이어가 가지는 루비에는 제한이 없습니다.
      </p>
      <h3>다이</h3>
      <p>베팅한 루비를 포기하고 해당 판에서 기권</p>
      <h3>콜</h3>
      <p>앞사람이 베팅한 루비와 동일하게 베팅</p>
      <h3>레이즈</h3>
      <p>앞사람이 베팅한 루비보다 더 많은 루비를 베팅</p>
      <h3>올인</h3>
      <p>가지고 있는 루비를 전부 베팅</p>
    </div>
  }else if(props.clicked === 3){
    return <div className={styles.contents}>
      <p>모든 플레이어는 카메라와 마이크를 켜고 플레이에 참여해야 합니다.</p>
    </div>
  }
}

export default function Tutorial() {

  let [clicked, changeTab] = useState(0);
      return (
        <div className={styles.container}>
          <Nav variant="tabs" defaultActiveKey="link-0" className={styles.nav}>
            <Nav.Item className={styles.navItem}>
              <Nav.Link eventKey="link-0" onClick={()=>{changeTab(0)}} className={styles.navLink}>게임룰</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="link-1" onClick={()=>{changeTab(1)}} className={styles.navLink}>족보</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="link-2" onClick={()=>{changeTab(2)}} className={styles.navLink}>베팅방법</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="link-3" onClick={()=>{changeTab(3)}} className={styles.navLink}>주의사항</Nav.Link>
            </Nav.Item>
          </Nav>
          <TabContent clicked={clicked} />
        </div>
      );
    }