import axios from 'axios';
import React,{useEffect, useState} from 'react';
import { useHistory,useParams } from 'react-router-dom/cjs/react-router-dom.min';
import { Accordion} from 'react-bootstrap';
import {CSSTransition} from "react-transition-group"

function MainAccordion(){


  return (
    <div>
       <Accordion defaultActiveKey="0">
  <Accordion.Item eventKey="0">
    <Accordion.Header>최근 공지사항</Accordion.Header>
    <Accordion.Body>
    주로 대학교 술자리에서, 분위기를 유쾌하게 만들면서 참가자들에게 술을 마시게 하는 목적으로 행하지는 게임. 선배나 동기들과 친해질 수 있게 되는 계기가 되면서도 술을 못 마시면 곤란해지는 상황이다. 술게임을 하면서 술자리의 흥이 오르고, 대부분의 경우엔 술에 취하는 속도 역시 엄청나게 탄력받는다. MT에서 술 게임에 제대로 몰입했다가 볼케이노를 시전하는 사람이 한 명씩은 꼭 나온다.
    </Accordion.Body>
  </Accordion.Item>
  <Accordion.Item eventKey="1">
    <Accordion.Header>지난 공지사항</Accordion.Header>
    <Accordion.Body>
    술 게임을 전혀 모르던 자들도 OT, 개강총회, MT 등을 겪으면서 본인의 의지와는 전혀 상관없이 저절로 배우게 되는 상황이 벌어진다. 정말 술게임에 대해서 몰라도 아는 사람들이 "마시면서~ 배우는~ 재미난~게~임~!"[1]을 외치며 강행하니 저절로 배우게 된다. 전혀 몰라도 대충 남들 하는대로 따라하면 되니까.
    </Accordion.Body>
  </Accordion.Item>
  <Accordion.Item eventKey="2">
    <Accordion.Header>지난 공지사항2</Accordion.Header>
    <Accordion.Body>
    술 게임을 전혀 모르던 자들도 OT, 개강총회, MT 등을 겪으면서 본인의 의지와는 전혀 상관없이 저절로 배우게 되는 상황이 벌어진다. 정말 술게임에 대해서 몰라도 아는 사람들이 "마시면서~ 배우는~ 재미난~게~임~!"[1]을 외치며 강행하니 저절로 배우게 된다. 전혀 몰라도 대충 남들 하는대로 따라하면 되니까.
    </Accordion.Body>
  </Accordion.Item>
</Accordion>
    </div>
  )
}




export default MainAccordion