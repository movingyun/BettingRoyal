import * as React from 'react';
import Button from '../components/Button';
import Typography from '../components/Typography';
import ProductHeroLayout from './ProductHeroLayout2';
import TextField from '@mui/material/TextField';
import mg from './stayhome.png'
// import Container from '@mui/material/Container';
import Box from '@mui/material/Box'
import { Container,Row, Col } from "react-bootstrap";
import './ProductHero.css'
import Proimg from './1.png'


export default function ProductHero() {
  return (
    <ProductHeroLayout
      sxBackground={{
        // backgroundImage: `url(${mg})`,
        backgroundColor: 'rgb(247,235,239)', // Average color of the background image.
        backgroundPosition: 'right',
      }}
    >
      {/* Increase the network loading priority of the background image. */}
      {/* <img
        style={{ display: 'none' }}
        src={mg}
        alt="increase priority"
      /> */}
      
      {/* <Typography
        color="black"
        align="center"
        variant="h5"
        sx={{ mb: 4, mt: { sx: 4, sm: 10 } }}
      >
        <Container maxWidth="sm">
        <Box sx={{ bgcolor: '', height: '30vh',width:'30vw' }} >
        <div className='dbox'>hihi</div>
        
        <h1>여기내용</h1>
</Box>
      </Container>
      </Typography> */}




<Container>
 
  <Row>

    <Col>
    
    <Typography
        color="black"
        align="center"
        variant="h3"
        sx={{ mb: 2, mt: { sx: 4, sm: 10 } }}
      >
       비대면 술자리 이용하기   
      </Typography>
      <Typography
        color="black"
        align="center"
        // variant="h5"
        sx={{ mb: 1, mt: { sx: 2, sm: 5 } }}
      >
        <h5>
        온라인 술자리도 오프라인 술자리처럼 느낄 수 있는 공간, 사람들과 바로 옆에 있는 듯한 느낌을 주는 우리만의 공간. 더 쉽게 어울리고 즐겁게 술 마실 수 있는 그런 공간 말이에요. 혹은  새로운 사람들을 만나고 싶을 때는 랜덤 입장을 이용해보세요! 새로운 사람들과 새로운 경험을 쌓을 수 있답니다.
        </h5>
      </Typography>
    
      </Col>
    
    <Col>
    
    <Typography
        color="black"
        align="center"
        variant="h3"
        sx={{ mb: 1, mt: { sx: 2, sm: 5 } }}
      >
       {/* 여기다 이미지박아용 */}
       <img src={Proimg} width="600vw"></img>
      
      </Typography></Col>
  </Row>
</Container>
      
      
    </ProductHeroLayout>
  );
}
