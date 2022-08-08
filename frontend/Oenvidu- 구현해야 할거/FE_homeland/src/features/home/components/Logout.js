import axios from 'axios';
import React,{useEffect, useState} from 'react';
import { useHistory,useParams } from 'react-router-dom/cjs/react-router-dom.min';
import { Button,Navbar,Container,Nav,NavDropdown,Carousel } from 'react-bootstrap';
import {CSSTransition} from "react-transition-group"

function Logout(){

  return(
    <div>
      <h1>로그아웃 페이지 입니다.</h1>
      

    </div>
  )
}




export default Logout