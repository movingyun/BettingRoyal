/* eslint-disable */
import axios from "axios";
import React, { useState } from "react";
import { useHistory, Link } from "react-router-dom";
import "./Login.css";
import LoginImage from "./image/login.png";
import { Button, Container, Form } from "react-bootstrap";

function Login() {
const BEUrl = process.env.REACT_APP_BACKEND_URL;
  const history = useHistory();
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const handleId = (event) => {
    event.preventDefault();
    setId(event.target.value);
  };
  const handlePassword = (event) => {
    event.preventDefault();
    setPassword(event.target.value);
  };

  const onLogin = (event) => {
    event.preventDefault();
    axios({
      url: `${BEUrl}/api/v1/auth/login`,
      method: "post",
      data: {
        id: id,
        password: password,
      },
    })
      .then((res) => {
        localStorage.setItem("jwt", res.data.accessToken);
        history.push("/");
      })
      .catch((err) => {
        if (err.response.status === 404) {
          alert("존재하지 않는 아이디입니다.");
        } else if (err.response.status === 401) {
          alert("비밀번호가 틀렸습니다.");
        }
      });
  };

  return (
    <div
      className="d-flex flex-column align-center"
      style={{ marginTop: "100px" }}
    >
      <h1
        className="mt-3"
        style={{ color: "#353f71", fontSize: "50px", fontWeight: "600" }}
      >
        로그인
      </h1>

      <Container style={{ width: "500px", marginTop: "50px" }}>
        <Form className="login-form">
          <Form.Group className="mb-3">
            <Form.Label className="login-font-size">ID</Form.Label>
            <Form.Control
              value={id}
              onChange={handleId}
              type="text"
              placeholder="ID를 입력하세요."
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label className="login-font-size">비밀번호</Form.Label>
            <Form.Control
              value={password}
              onChange={handlePassword}
              type="password"
              placeholder="비밀번호를 입력하세요."
            />
          </Form.Group>
          <Form.Group className="d-flex justify-content-center">
            <button
              className="btn btn-color my-3"
              type="submit"
              onClick={onLogin}
            >
              로그인
            </button>
          </Form.Group>
          <div className="d-flex justify-content-between mt-3">
            <div>
              <Link className="link-font" to="/check-email">
                비밀번호 찾기
              </Link>
            </div>
            <div>
              <Link className="link-font" to="/signup">
                회원가입
              </Link>
            </div>
          </div>
        </Form>
      </Container>
    </div>
  );
}

export default Login;
