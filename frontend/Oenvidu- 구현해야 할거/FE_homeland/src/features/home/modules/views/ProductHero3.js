import * as React from 'react';
import Typography from '../components/Typography';
import ProductHeroLayout from './ProductHeroLayout2';
import mg from './liar.png'
// import Container from '@mui/material/Container';
import Box from '@mui/material/Box'
import { Container,Row, Col } from "react-bootstrap";
import './ProductHero.css'
import Proimg from './2.png'



export default function ProductHero() {
  return (
    <ProductHeroLayout
      sxBackground={{
        // backgroundImage: `url(${mg})`,
        backgroundColor: 'rgb(247,235,239)', // Average color of the background image.
        backgroundPosition: 'left',
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
<h1>누구나 쉽게 어울릴 수 있는 곳</h1>
<h5>모처럼 한가하다면 술게임을 진행해 보세요. 같은방에 있는 친구들과 함께할 수 있답니다.</h5>
</Box>
      </Container>
      </Typography> */}
      <Container>
 
 <Row>
   <Col>
     <Typography
       color="black"
       align="left"
       variant="h3"
       sx={{ mb: 1, mt: { sx: 2, sm: 5 } }}
     >
        <img src={Proimg} width="600vw"></img>
     </Typography>
     </Col>
   <Col>
   <Typography
       color="black"
       align="center"
       variant="h3"
       sx={{ mb: 2, mt: { sx: 4, sm: 10 } }}
     >
      라이어 게임 즐기기   
     </Typography>
   <Typography
       color="black"
       align="center"
      //  variant="h6"
       sx={{ mb: 1, mt: { sx: 2, sm: 5 } }}
     >
       <h5>
       사회자가 없이 즐기기 힘든 라이어게임을 HomeLanD에서 다함께 즐겨요. 랜덤으로 라이어를 정해주고 라이어가 아닌 사람들에게는 주제에 맞는 제시어가 주어집니다. 라이어는 정체를 들키지 않게 최대한 눈치껏 제시어에 대해 설명해 봅시다. 누가 누가 거짓말 중인지 눈을 크게 뜨고 찾아봐요!

       </h5>
     
     </Typography></Col>
 </Row>
</Container>
      
      
    </ProductHeroLayout>
  );
}
