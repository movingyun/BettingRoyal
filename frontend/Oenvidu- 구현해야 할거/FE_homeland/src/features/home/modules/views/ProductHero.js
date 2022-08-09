/* eslint-disable */
import * as React from "react";
import Button from "../components/Button";
import Typography from "../components/Typography";
import ProductHeroLayout from "./ProductHeroLayout";
import TextField from "@mui/material/TextField";
import mg from "./vc2.png";
import { Link } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import sm from './scrolld.png'

export default function ProductHero() {
  return (
    <ProductHeroLayout
      sxBackground={{
        backgroundImage: `url(${mg})`,
        backgroundColor: "rgb(247,235,239)", // Average color of the background image.
        backgroundPosition: "center",
      }}
    >
      {/* Increase the network loading priority of the background image. */}
      <img style={{ display: "none" }} src={mg} alt="increase priority" />
      <Typography color="inherit" align="center" variant="h1" marked="center">
        HOME LAND
      </Typography>
      <Typography
        color="inherit"
        align="center"
        variant="h3"
        sx={{ mb: 4, mt: { sx: 4, sm: 10 } }}
      >
        <br></br>
        함께하는 온라인 술자리
      </Typography>
      <Link to="/meeting-main" style={{ textDecoration: 'none' }}>
        <Button
          color="secondary"
          variant="contained"
          size="large"
          sx={{ minWidth: 200 }}
        >
          술자리입장
        </Button>
      </Link>

      <Typography variant="body2" color="inherit" sx={{ mt: 2 }}>
      
      </Typography>
      <Container>
        <Row>
          <Col></Col>
            <Col>
              <div className="chc">
                <div className="ddddbox">
                  <h5>Scroll Plz~</h5>
                </div>
              </div>
            </Col>
          <Col></Col>
        </Row>
      </Container>

    </ProductHeroLayout>
  );
}
