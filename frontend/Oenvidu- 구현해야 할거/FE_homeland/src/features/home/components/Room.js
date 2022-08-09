import axios from 'axios';
import React,{useEffect, useState} from 'react';
import { useHistory,useParams } from 'react-router-dom/cjs/react-router-dom.min';
import { Button,Navbar,Container,Nav,NavDropdown,Carousel,Row,Col } from 'react-bootstrap';
import {CSSTransition} from "react-transition-group"

function Room(){
  return(
    <div>
      <Container>
  <Row>
    <Col sm={9}>
    <Row>
    <Col><h1>1번참가자</h1></Col>
    <Col><h1>2번참가자</h1></Col>
    <Col><h1>3번참가자</h1></Col>
  </Row>
  <Row>
    <Col><h1>4번참가자</h1></Col>
    <Col><h1>5번참가자</h1></Col>
    <Col><h1>6번참가자</h1></Col>
  </Row>
    </Col>
    <Col sm={3}><h1>채팅방이될곳</h1></Col>
  </Row>
  
</Container>
<h1>하단 기능이 들어갈 곳</h1>
    </div>
  )
}

export default Room