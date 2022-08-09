import axios from 'axios';
import React,{useEffect, useState} from 'react';
import { useHistory,useParams } from 'react-router-dom/cjs/react-router-dom.min';
import { Button,Navbar,Container,Nav,NavDropdown,Carousel,Row,Col, InputGroup, FormControl} from 'react-bootstrap';
import {CSSTransition} from "react-transition-group"
import Data from './data.js';

function MainCarousel(){

  const [Notes, NoteChange] = useState(Data);

  return (
    <div>
      <Carousel variant='dark'>
            { Notes.map((Note, i)=> {
              return (
                <Carousel.Item key={i}>
                  <br></br>
                  <br></br>
                  <h4>업데이트 캐러셀이다~~</h4>
                  <br></br>
                  <h4>여기는 이미지 넣는곳</h4>
                  <br></br>
                  <br></br>
                  <br></br>
                  <br></br>
                  <br></br>
                  <br></br>
                  <br></br>
                  <br></br>
                  <Carousel.Caption className="Black-color">
                  <h3>{Note.title}</h3>
                  <p>{Note.content}</p>
                  <p>{Note.date}</p>
                  </Carousel.Caption>
                </Carousel.Item>
              )
            })}
            
          </Carousel>
    </div>
  )
}




export default MainCarousel