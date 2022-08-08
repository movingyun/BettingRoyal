/* eslint-disable */
import { Form, Container } from "react-bootstrap";
import { Link, useHistory } from "react-router-dom";
import "./EditProfile.css";
import axios from "axios";
import { useState, useEffect } from "react";
import { Button } from "@mui/material";

function EditProfile() {
  const BEUrl = process.env.REACT_APP_BACKEND_URL;

  const history = useHistory();
  const [newNickname, setNewNickname] = useState("");
  const [nicknameValid, setNicknameValid] = useState("");
  const [nicknameValidFeedback, setNicknameValidFeedback] = useState("");
  const [nicknameValidMessage, setNicknameValidMessage] = useState("");

  const [newEmail, setNewEmail] = useState("");
  const [emailValid, setEmailValid] = useState("");
  const [emailValidFeedback, setEmailValidFeedback] = useState("");
  const [emailValidMessage, setEmailValidMessage] = useState("");

  const handleNewNickname = (event) => {
    event.preventDefault();
    const eValue = event.target.value;
    if ((eValue && eValue.length < 3) || eValue.length > 10) {
      setNicknameValid("is-invalid");
      setNicknameValidFeedback("invalid-feedback");
      setNicknameValidMessage("3글자 이상 10글자 이하로 입력해주세요.");
    } else if (!eValue) {
      setNicknameValid("");
      setNicknameValidFeedback("");
      setNicknameValidMessage("");
    } else {
      setNicknameValid("is-valid");
      setNicknameValidFeedback("valid-feedback");
      setNicknameValidMessage("올바른 형식입니다!");
    }
    setNewNickname(event.target.value);
  };

  const onCheckNickname = (event) => {
    event.preventDefault();
    if (!newNickname) {
      setNicknameValid("is-invalid");
      alert("닉네임을 입력해주세요");
    } else {
      axios({
        url: `${BEUrl}/api/v1/users/duplicate-check-nickname`,
        method: "post",
        data: {
          nickname: newNickname,
        },
      })
        .then(() => {
          alert("사용 가능한 닉네임입니다!");
        })
        .catch((err) => {
          if (err.response.status === 409) {
            alert("중복된 닉네임입니다!");
          }
        });
    }
  };

  const handleNewEmail = (event) => {
    event.preventDefault();
    const eValue = event.target.value;
    const emailRegex =
      /([\w-.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
    if (eValue && !emailRegex.test(eValue)) {
      setEmailValid("is-invalid");
      setEmailValidFeedback("invalid-feedback");
      setEmailValidMessage("올바른 E-mail 형식이 아닙니다.");
    } else if (!eValue) {
      setEmailValid("");
      setEmailValidFeedback("");
      setEmailValidMessage("");
    } else {
      setEmailValid("is-valid");
      setEmailValidFeedback("valid-feedback");
      setEmailValidMessage("올바른 형식입니다!");
    }

    setNewEmail(event.target.value);
  };

  const onCheckEmail = (event) => {
    event.preventDefault();
    const emailRegex =
      /([\w-.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
    if (newEmail && !emailRegex.test(newEmail)) {
      setEmailValid("is-invalid");
      alert("올바른 이메일 형식이 아닙니다.");
    } else if (!newEmail) {
      setEmailValid("is-invalid");
      alert("이메일을 입력해주세요.");
    } else {
      axios({
        url: `${BEUrl}/api/v1/users/duplicate-check-email`,
        method: "post",
        data: {
          email: newEmail,
        },
      })
        .then(() => {
          alert("사용 가능한 E-mail입니다!");
        })
        .catch((err) => {
          if (err.response.status === 409) {
            alert("중복된 E-mail입니다!");
          }
        });
    }
  };
  const onEdit = (event) => {
    event.preventDefault();
    axios({
      url: `${BEUrl}/api/v1/users/edit`,
      method: "put",
      headers: setToken(),
      data: {
        nickname: newNickname,
        email: newEmail,
      },
    })
      .then(() => {
        history.push("/mypage");
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const getProfile = () => {
    axios({
      url: `${BEUrl}/api/v1/users/me`,
      method: "get",
      headers: setToken(),
    }).then((res) => {
      setNewNickname(res.data.nickname);
      setNewEmail(res.data.email);
    });
  };

  const setToken = () => {
    const token = localStorage.getItem("jwt");
    const config = {
      Authorization: `Bearer ${token}`,
    };
    return config;
  };

  useEffect(() => {
    getProfile();
  }, []);

  return (
    <div style={{ paddingTop: "100px" }}>
      <h1
        className="mt-3"
        style={{ color: "#353f71", fontSize: "50px", fontWeight: "600" }}
      >
        회원정보 수정
      </h1>
      <Container style={{ width: "500px", marginTop: "50px" }}>
        <Form className="edit-profile-form">
          <Form.Group className="mb-3">
            <Form.Label className="edit-profile-font-size">
              닉네임 변경
            </Form.Label>
            <Form.Control
              className={nicknameValid}
              value={newNickname}
              onChange={handleNewNickname}
              type="text"
              placeholder="새 닉네임을 입력하세요."
            />
            <div
              className={`${nicknameValidFeedback} d-flex justify-content-between`}
            >
              <div>{nicknameValidMessage}</div>
              <Button onClick={onCheckNickname}>닉네임 중복확인</Button>
            </div>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label className="edit-profile-font-size">
              E-mail 변경
            </Form.Label>
            <Form.Control
              className={emailValid}
              value={newEmail}
              onChange={handleNewEmail}
              type="email"
              placeholder="새 E-mail을 입력하세요."
            />
            <div
              className={`${emailValidFeedback} d-flex justify-content-between`}
            >
              <div>{emailValidMessage}</div>
              <Button onClick={onCheckEmail}>E-mail 중복확인</Button>
            </div>
          </Form.Group>
          <Form.Group className="d-flex justify-content-center mb-3">
            <button className="btn btn-color" type="submit" onClick={onEdit}>
              수정하기
            </button>
          </Form.Group>
          <div className="d-flex justify-content-end">
            <Link className="link-font" to="/check-password">
              <p>비밀번호 변경</p>
            </Link>
          </div>
        </Form>
      </Container>
    </div>
  );
}

export default EditProfile;
