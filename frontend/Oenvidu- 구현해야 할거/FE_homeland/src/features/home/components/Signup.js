/* eslint-disable */
import React, { useEffect, useState } from "react";
import { Form, Button, InputGroup } from "react-bootstrap";
import "./Signup.css";
import { Link, Redirect, useHistory } from "react-router-dom";
import axios from "axios";

function Sign() {
  const [id, setId] = useState("");
  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [email, setEmail] = useState("");

  const handleId = (event) => {
    event.preventDefault();
    setId(event.target.value);
  };
  const handleNickname = (event) => {
    event.preventDefault();
    setNickname(event.target.value);
  };
  const handlePassword = (event) => {
    event.preventDefault();
    setPassword(event.target.value);
  };
  const handlePasswordConfirm = (event) => {
    event.preventDefault();
    setPasswordConfirm(event.target.value);
  };
  const handleEmail = (event) => {
    event.preventDefault();
    setEmail(event.target.value);
  };

  // const onSubmit = () => {
  //   fetch("http://localhost:8080/api/v1/users", {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify({
  //       id: id,
  //       nickname: nickname,
  //       password: password,
  //       email: email,
  //     }),
  //   })
  //     .then((res) => res.json())
  //     .then((res) => {
  //       console.log(res);
  //       // return <Redirect to="/login" />;
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });
  // };

  const onSubmit = (event) => {
    event.preventDefault();
    axios({
      url: "http://localhost:8080/api/v1/users",
      method: "post",
      data: {
        id: id,
        nickname: nickname,
        password: password,
        email: email,
      },
    }).then((res) => {
      console.log(res);
    });
  };

  return (
    <div>
      <h1 className="mt-3">회원가입</h1>
      <Form className="container signup-form">
        <Form.Group className="mb-3" controlId="formGroupID">
          <Form.Label>아이디</Form.Label>
          <Form.Control
            value={id}
            onChange={handleId}
            type="text"
            placeholder="아이디 입력"
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formGroupNickname">
          <Form.Label>닉네임</Form.Label>
          <Form.Control
            value={nickname}
            onChange={handleNickname}
            type="text"
            placeholder="닉네임 입력"
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formGroupPassword">
          <Form.Label>비밀번호</Form.Label>
          <Form.Control
            value={password}
            onChange={handlePassword}
            type="password"
            placeholder="비밀번호 입력"
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formGroupCheckPassword">
          <Form.Label>비밀번호 확인</Form.Label>
          <Form.Control
            value={passwordConfirm}
            onChange={handlePasswordConfirm}
            type="password"
            placeholder="비밀번호 확인"
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formGroupEmail">
          <Form.Label>e-mail</Form.Label>
          <Form.Control
            value={email}
            onChange={handleEmail}
            type="email"
            placeholder="e-mail 입력"
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formGroupCheckEmail">
          <Form.Label>인증코드 입력</Form.Label>
          <InputGroup>
            <Form.Control type="text" placeholder="인증번호 입력" />
            <Button>인증하기</Button>
          </InputGroup>
          <Form.Text className="text-muted">
            가입 이후 이메일 인증을 통해 비밀번호를 찾을 수 있습니다.
          </Form.Text>
        </Form.Group>
        <Form.Group className="d-flex justify-content-between">
          <Form.Text>이메일이 도착하지 않았나요?</Form.Text>
          <Link to="#">다시 보내기</Link>
        </Form.Group>
        <Form.Group className="d-flex justify-content-center mt-3">
          <Button type="submit" onClick={onSubmit}>
            가입하기
          </Button>
        </Form.Group>
      </Form>
    </div>
  );
}

export default Sign;
