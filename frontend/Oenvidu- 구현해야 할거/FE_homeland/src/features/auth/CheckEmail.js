/* eslint-disable */
import { Form, Button, Container } from "react-bootstrap";
import "./CheckEmail.css";
import axios from "axios";
import { useHistory } from "react-router-dom";
import { useState } from "react";

function CheckEmail() {
	const BEUrl = process.env.REACT_APP_BACKEND_URL;

  const history = useHistory();
  const [id, setId] = useState("");
  const [email, setEmail] = useState("");
  const handleId = (event) => {
    event.preventDefault();
    setId(event.target.value);
  };
  const handleEmail = (event) => {
    event.preventDefault();
    setEmail(event.target.value);
  };
  const onCheckEmail = (event) => {
    event.preventDefault();
    axios({
      url: `${BEUrl}/api/v1/users/find-password`,
      method: "post",
      data: {
        id: id,
        email: email,
      },
    })
      .then(() => {
        setId("");
        setEmail("");
        alert("E-mail 인증 요청이 완료되었습니다. E-Mail을 확인해주세요.");
        history.push("/");
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <div style={{ paddingTop: "100px" }}>
      <h1
        className="mt-3"
        style={{ color: "#353f71", fontSize: "50px", fontWeight: "600" }}
      >
        ID & E-mail 체크
      </h1>
      <Container style={{ width: "500px", marginTop: "50px" }}>
        <Form className="check-email-form">
          <Form.Group className="mb-3">
            <Form.Label className="check-email-font-size">ID</Form.Label>
            <Form.Control
              value={id}
              onChange={handleId}
              type="text"
              placeholder="ID를 입력하세요."
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label className="check-email-font-size">E-mail</Form.Label>
            <Form.Control
              value={email}
              onChange={handleEmail}
              type="email"
              placeholder="E-mail을 입력하세요."
            />
          </Form.Group>

          <Form.Group className="d-flex justify-content-center">
            <button
              className="btn btn-color"
              type="submit"
              onClick={onCheckEmail}
            >
              E-mail 인증 요청
            </button>
          </Form.Group>
        </Form>
      </Container>
    </div>
  );
}

export default CheckEmail;
