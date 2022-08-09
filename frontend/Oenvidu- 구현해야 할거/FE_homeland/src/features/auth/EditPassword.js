/* eslint-disable */
import { useHistory } from "react-router-dom";
import "./EditPassword.css";
import axios from "axios";
import { useState, useEffect } from "react";
import { Form, Container } from "react-bootstrap";

function EditPassword() {
	const BEUrl = process.env.REACT_APP_BACKEND_URL;

  const history = useHistory();
  const setToken = () => {
    const token = localStorage.getItem("jwt");
    const config = {
      Authorization: `Bearer ${token}`,
    };
    return config;
  };

  const [newPassword, setNewPassword] = useState("");
  const [checkNewPassword, setCheckNewPassword] = useState("");
  const handleNewPassword = (event) => {
    event.preventDefault();
    setNewPassword(event.target.value);
  };
  const handleCheckNewPassword = (event) => {
    event.preventDefault();
    setCheckNewPassword(event.target.value);
  };
  const onEditPassword = (event) => {
    event.preventDefault();
    axios({
      url: `${BEUrl}/api/v1/users/edit-password`,
      method: "put",
      headers: setToken(),
      data: {
        password: newPassword,
      },
    })
      .then(() => {
        history.push("/mypage");
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
        비밀번호 변경
      </h1>
      <Container style={{ width: "500px", marginTop: "50px" }}>
        <Form className="edit-password-form">
          <Form.Group className="mb-3">
            <Form.Label className="edit-password-font-size">
              새 비밀번호
            </Form.Label>
            <Form.Control
              value={newPassword}
              onChange={handleNewPassword}
              type="password"
              placeholder="새 비밀번호를 입력하세요."
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label className="edit-password-font-size">
              새 비밀번호 확인
            </Form.Label>
            <Form.Control
              value={checkNewPassword}
              onChange={handleCheckNewPassword}
              type="password"
              placeholder="새 비밀번호를 다시 입력하세요."
            />
          </Form.Group>
          <Form.Group className="d-flex justify-content-center">
            <button
              className="btn btn-color"
              type="submit"
              onClick={onEditPassword}
            >
              변경하기
            </button>
          </Form.Group>
        </Form>
      </Container>
    </div>
  );
}

export default EditPassword;
