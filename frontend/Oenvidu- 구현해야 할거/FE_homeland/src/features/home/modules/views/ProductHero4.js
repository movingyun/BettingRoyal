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
import Proimg from './3.png'



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
      다 함께 짠 하기   
     </Typography>
   <Typography
       color="black"
       align="center"
      //  variant="h6"
       sx={{ mb: 1, mt: { sx: 2, sm: 5 } }}
     >
       <h5>
       오프라인 술자리의 묘미는 다 같이 술잔을 부딪히며 ‘짠’하는 건데 온라인에서는 못해서 아쉬우셨죠? HomeLanD에서는 그런 아쉬움을 날리기 위해 짠 효과 기능이 있답니다!  건배 버튼을 누르고 맥주 이모티콘과 함께 다 같이 술잔을 모니터에 가까이 대며 짠~ 크게 외쳐보아요     

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
