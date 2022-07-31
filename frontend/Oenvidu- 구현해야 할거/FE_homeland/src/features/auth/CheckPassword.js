/* eslint-disable */
import axios from "axios";
import { useState, useEffect } from "react";
import { Form, Button, Container } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import "./CheckPassword.css";

function CheckPassword() {
	const BEUrl = process.env.REACT_APP_BACKEND_URL;

  const history = useHistory();
  const [password, setPassword] = useState("");
  const handleCheckPassword = (event) => {
    event.preventDefault();
    setPassword(event.target.value);
  };
  const onCheckPasswordSubmit = (event) => {
    event.preventDefault();
    axios({
      url: `${BEUrl}/api/v1/auth/check-password`,
      method: "post",
      headers: setToken(),
      data: {
        password: password,
      },
    })
      .then(() => {
        history.push("/edit-password");
      })
      .catch(() => {
        alert("비밀번호가 틀렸습니다.");
      });
  };
  const setToken = () => {
    const token = localStorage.getItem("jwt");
    const config = {
      Authorization: `Bearer ${token}`,
    };
    return config;
  };
  return (
    <div style={{ paddingTop: "100px" }}>
      <h1
        className="mt-3"
        style={{ color: "#353f71", fontSize: "50px", fontWeight: "600" }}
      >
        비밀번호 확인
      </h1>
      <Container style={{ width: "500px", marginTop: "50px" }}>
        <Form className="check-password-form">
          <Form.Group className="mb-3">
            <Form.Label className="check-password-font-size">
              비밀번호
            </Form.Label>
            <Form.Control
              value={password}
              onChange={handleCheckPassword}
              type="password"
              placeholder="비밀번호를 입력하세요."
            />
          </Form.Group>
          <Form.Group className="d-flex justify-content-center mb-3">
            <button
              className="btn btn-color"
              type="submit"
              onClick={onCheckPasswordSubmit}
            >
              확인
            </button>
          </Form.Group>
        </Form>
      </Container>
    </div>
  );
}

export default CheckPassword;
