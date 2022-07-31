import "./FindPassword.css";
import { useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import axios from "axios";
import { Form, Container } from "react-bootstrap";

function FindPassword() {
	const BEUrl = process.env.REACT_APP_BACKEND_URL;

  const history = useHistory();
  const { key } = useParams();
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const handleNewPassword = (event) => {
    event.preventDefault();
    setNewPassword(event.target.value);
  };
  const handleConfirmNewPassword = (event) => {
    event.preventDefault();
    setConfirmNewPassword(event.target.value);
  };
  const onChangePassword = (event) => {
    event.preventDefault();
    if (newPassword && newPassword === confirmNewPassword) {
      axios({
        url: `${BEUrl}/api/v1/users/password/${key}`,
        method: "put",
        data: {
          password: newPassword,
        },
      })
        .then(() => {
          history.push("/login");
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      alert("비밀번호와 비밀번호 확인이 다릅니다.");
    }
  };
  return (
    <div style={{ paddingTop: "100px" }}>
      <h1
        className="mt-3"
        style={{ color: "#353f71", fontSize: "50px", fontWeight: "600" }}
      >
        새 비밀번호로 변경
      </h1>
      <Container style={{ width: "500px", marginTop: "50px" }}>
        <Form className="find-password-form">
          <Form.Group className="mb-3">
            <Form.Label className="find-password-font-size">
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
            <Form.Label className="find-password-font-size">
              새 비밀번호 확인
            </Form.Label>
            <Form.Control
              value={confirmNewPassword}
              onChange={handleConfirmNewPassword}
              type="password"
              placeholder="새 비밀번호를 다시 입력하세요."
            />
          </Form.Group>
          <Form.Group className="d-flex justify-content-center">
            <button
              className="btn btn-color"
              type="submit"
              onClick={onChangePassword}
            >
              변경하기
            </button>
          </Form.Group>
        </Form>
      </Container>
    </div>
  );
}

export default FindPassword;
