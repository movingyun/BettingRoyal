/* eslint-disable */
import React, { useEffect, useState } from "react";
import "./Signup.css";
import { Link, useHistory } from "react-router-dom";
import axios from "axios";
import { Form, Container } from "react-bootstrap";
import Button from "@mui/material/Button";

function Sign() {
  const BEUrl = process.env.REACT_APP_BACKEND_URL;
  const history = useHistory();
  // id 관련
  const [id, setId] = useState("");
  const [idError, setIdError] = useState(false);
  const [idValid, setIdValid] = useState("");
  const [idValidFeedback, setIdValidFeedback] = useState("");
  const [idValidMessage, setIdValidMessage] = useState("");
  // 닉네임 관련
  const [nickname, setNickname] = useState("");
  const [nicknameError, setNicknameError] = useState(false);
  const [nicknameValid, setNicknameValid] = useState("");
  const [nicknameValidFeedback, setNicknameValidFeedback] = useState("");
  const [nicknameValidMessage, setNicknameValidMessage] = useState("");
  // 이메일 관련
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [emailValid, setEmailValid] = useState("");
  const [emailValidFeedback, setEmailValidFeedback] = useState("");
  const [emailValidMessage, setEmailValidMessage] = useState("");
  // 비밀번호 관련
  const [passwordError, setPasswordError] = useState(false);
  const [passwordConfirmError, setPasswordConfirmError] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");

  const handleId = (event) => {
    event.preventDefault();
    const eValue = event.target.value;
    if ((eValue && eValue.length < 3) || eValue.length > 10) {
      setIdValid("is-invalid");
      setIdValidFeedback("invalid-feedback");
      setIdValidMessage("3글자 이상 10글자 이하로 입력해주세요.");
    } else if (!eValue) {
      setIdValid("");
      setIdValidFeedback("");
      setIdValidMessage("");
    } else {
      setIdValid("is-valid");
      setIdValidFeedback("valid-feedback");
      setIdValidMessage("올바른 형식입니다!");
    }
    setIdError(false);
    setId(event.target.value);
  };

  const handleNickname = (event) => {
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
    setNicknameError(false);
    setNickname(event.target.value);
  };

  const handleEmail = (event) => {
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
    setEmailError("");
    setEmail(event.target.value);
  };

  const handlePassword = (event) => {
    event.preventDefault();
    setPasswordError(false);
    setPassword(event.target.value);
  };
  const handlePasswordConfirm = (event) => {
    event.preventDefault();
    setPasswordConfirmError(false);
    setPasswordConfirm(event.target.value);
  };

  const onSubmit = (event) => {
    event.preventDefault();
    const emailRegex =
      /([\w-.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
    if (email && !emailRegex.test(email)) {
      setEmailError(true);
      alert("이메일 형식을 확인해주세요");
    }
    if (!id) {
      setIdError(true);
      alert("ID를 입력해주세요");
    }
    if (!nickname) {
      setNicknameError(true);
      alert("닉네임을 입력해주세요.");
    }
    if (!email) {
      setEmailError(true);
      alert("E-mail을 입력해주세요.");
    }
    if (!password) {
      setPasswordError(true);
      alert("비밀번호를 입력해주세요.");
    }
    if (!passwordConfirm) {
      setPasswordConfirmError(true);
      alert("비밀번호를 다시 한번 입력해주세요.");
    }
    if (password && passwordConfirm && password !== passwordConfirm) {
      setPasswordConfirmError(true);
      alert("비밀번호와 비밀번호 확인이 일치해야 합니다.");
    }
    if (
      !idError &&
      !nicknameError &&
      !emailError &&
      !passwordError &&
      !passwordConfirmError &&
      password === passwordConfirm
    ) {
      axios({
        url: `${BEUrl}/api/v1/users`,
        method: "post",
        data: {
          id: id,
          nickname: nickname,
          password: password,
          email: email,
        },
      })
        .then(() => {
          history.push("/login");
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };
  // 아이디 중복확인
  const onCheckId = (event) => {
    event.preventDefault();
    if (!id) {
      alert("ID를 입력해주세요.");
      setIdError(true);
      setIdValid("is-invalid");
    } else {
      axios({
        url: `${BEUrl}/api/v1/users/duplicate-check-id`,
        method: "post",
        data: {
          id: id,
        },
      })
        .then(() => {
          alert("사용 가능한 ID입니다!");
        })
        .catch((err) => {
          if (err.response.status === 409) {
            setIdError(true);
            alert("중복된 ID입니다!");
          }
        });
    }
  };
  // 닉네임 중복확인
  const onCheckNickname = (event) => {
    event.preventDefault();
    if (!nickname) {
      setNicknameError(true);
      setNicknameValid("is-invalid");
      alert("닉네임을 입력해주세요");
    } else {
      axios({
        url: `${BEUrl}/api/v1/users/duplicate-check-nickname`,
        method: "post",
        data: {
          nickname: nickname,
        },
      })
        .then(() => {
          alert("사용 가능한 닉네임입니다!");
        })
        .catch((err) => {
          if (err.response.status === 409) {
            setNicknameError(true);
            alert("중복된 닉네임입니다!");
          }
        });
    }
  };
  // 이메일 중복확인
  const onCheckEmail = (event) => {
    event.preventDefault();
    const emailRegex =
      /([\w-.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
    if (email && !emailRegex.test(email)) {
      setEmailError(true);
      setEmailValid("is-invalid");
      alert("올바른 이메일 형식이 아닙니다.");
    } else if (!email) {
      setEmailValid("is-invalid");
      setEmailError(true);
      alert("이메일을 입력해주세요.");
    } else {
      axios({
        url: `${BEUrl}/api/v1/users/duplicate-check-email`,
        method: "post",
        data: {
          email: email,
        },
      })
        .then(() => {
          alert("사용 가능한 E-mail입니다!");
        })
        .catch((err) => {
          if (err.response.status === 409) {
            setEmailError(true);
            alert("중복된 E-mail입니다!");
          }
        });
    }
  };

  return (
    <div>
      <div
        className="d-flex flex-column align-center"
        style={{ marginTop: "100px" }}
      >
        <h1
          className="mt-3"
          style={{ color: "#353f71", fontSize: "50px", fontWeight: "600" }}
        >
          회원가입
        </h1>
        <Container style={{ width: "500px", marginTop: "50px" }}>
          <Form className="signup-form">
            <Form.Group>
              <Form.Label className="signup-font-size">ID</Form.Label>
              <Form.Control
                className={idValid}
                value={id || ""}
                onChange={handleId}
                type="text"
                placeholder="ID를 입력하세요."
              />
              <div
                className={`${idValidFeedback} d-flex justify-content-between`}
              >
                <div>{idValidMessage}</div>
                <Button onClick={onCheckId}>ID 중복확인</Button>
              </div>
            </Form.Group>
            <Form.Group>
              <Form.Label className="signup-font-size">닉네임</Form.Label>
              <Form.Control
                className={nicknameValid}
                value={nickname}
                onChange={handleNickname}
                type="text"
                placeholder="닉네임을 입력하세요."
              />
              <div
                className={`${nicknameValidFeedback} d-flex justify-content-between`}
              >
                <div>{nicknameValidMessage}</div>
                <Button onClick={onCheckNickname}>닉네임 중복확인</Button>
              </div>
            </Form.Group>
            <Form.Group>
              <Form.Label className="signup-font-size">E-mail</Form.Label>
              <Form.Control
                className={emailValid}
                value={email}
                onChange={handleEmail}
                type="email"
                placeholder="E-mail을 입력하세요."
              />
              <div
                className={`${emailValidFeedback} d-flex justify-content-between`}
              >
                <div>{emailValidMessage}</div>
                <Button onClick={onCheckEmail}>E-mail 중복확인</Button>
              </div>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className="signup-font-size">비밀번호</Form.Label>
              <Form.Control
                value={password}
                onChange={handlePassword}
                type="password"
                placeholder="비밀번호를 입력하세요."
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className="signup-font-size">
                비밀번호 확인
              </Form.Label>
              <Form.Control
                value={passwordConfirm}
                onChange={handlePasswordConfirm}
                type="password"
                placeholder="비밀번호를 다시 입력하세요."
              />
            </Form.Group>
            <Form.Group className="d-flex justify-content-center mb-3">
              <button
                className="btn btn-color mt-3"
                type="submit"
                onClick={onSubmit}
              >
                회원가입
              </button>
            </Form.Group>
            <div className="d-flex justify-content-end">
              <Link className="link-font mt-3" to="/login" variant="body2">
                계정이 있으신가요? 로그인
              </Link>
            </div>
          </Form>
        </Container>
      </div>
    </div>
  );
}

export default Sign;
