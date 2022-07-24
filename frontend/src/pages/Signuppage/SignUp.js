import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
// import React, { Component } from 'react';
import { React, useState } from "react";
import axios from "axios";
import InputWithLabel from "../../components/Logincomp/InputWithLabel";
import AuthContent from "../../components/Logincomp/AuthContent";

export default function SignUpPage() {
  const [NickName, setNickName] = useState("");
  const [Email, setEmail] = useState("");
  const [Gender, setGender] = useState("F");
  const [Password, setPassword] = useState("");
  const [PasswordCheck, setPasswordCheck] = useState("");

  const [ErrorMsgPassword, setErrorMsgPassword] = useState("");

  const onNickNameHandler = (event) => {
    setNickName(event.currentTarget.value);
  };

  const onEmailHandler = (event) => {
    setEmail(event.currentTarget.value);
  };

  const onGenderHandler = (event) => {
    setGender(event.currentTarget.value);
  };

  const onPasswordHandler = (event) => {
    setPassword(event.currentTarget.value);
  };

  const onPasswordCheckHandler = (event) => {
    setPasswordCheck(event.currentTarget.value);
    if (event.currentTarget.value !== Password)
      setErrorMsgPassword("비밀번호를 확인해주세요.");
    else setErrorMsgPassword("");
  };

  const navigate = useNavigate();

  const onSubmitHandler = (event) => {
    event.preventDefault();

    const userInfo = {
      NickName: NickName,
      Email: Email,
      Gender: Gender,
      Password: Password,
      PasswordCheck: PasswordCheck,
    };

    var hasEmptyInfo = false;
    for (var i in userInfo) {
      if (!userInfo[i]) {
        hasEmptyInfo = true;
      }
    }

    if (hasEmptyInfo) {
      alert("모든 항목을 다 입력하세요.");
    } else {

      createUserFetch(userInfo).then((data) => {
        alert("로그인 성공");
        // if(data.success) {
        //     console.log("로긴대따");
        // } else {
        //     alert("ㄴㄴ");
        // }
      });
    }
    navigate("/");
  };

  async function createUserFetch(userInfo) {
    // const requestOptions = {
    //     method: "post",
    //     headers : {
    //         "content-type": "application/json"
    //     },
    //     body : JSON.stringify(userInfo)
    // };

    // const response = await fetch(
    //     'http://localhost:3000/',
    //      requestOptions
    // );
    // const data = await response.json();
    // return data

    var axios = require("axios");

    // var config = {
    //   method: "post",
    //   url: "",
    // };
    console.log(Email, Password)
    axios.post('/api/v1/users',{id:Email,password:Password})
      .then(function (response) {
        console.log(JSON.stringify(response.statusCode));

      })
      .catch(function (error) {
        console.log(error);
      });
  }

  return (
    <div className="/signup">
      <h1>
        <Link to="/">멘탈리스트</Link>
      </h1>
      <AuthContent>
        NickName{" "}
        <InputWithLabel
          required="required"
          label="닉네임"
          name="nickname"
          onChange={onNickNameHandler}
          placeholder="닉네임을 작성하세요."
        />
        <br />
        Email{" "}
        <InputWithLabel
          required="required"
          label="이메일"
          name="email"
          onChange={onEmailHandler}
          placeholder="이메일을 작성하세요."
        />
        <br />
        Gender{" "}
        <InputWithLabel
          required="required"
          label="성별"
          name="gender"
          onChange={onGenderHandler}
          placeholder="성별을 선택하세요."
        />
        <br />
        Password{" "}
        <InputWithLabel
          required="required"
          label="비밀번호"
          id="password"
          value={Password}
          onChange={onPasswordHandler}
          placeholder="비밀번호를 작성하세요."
          type="password"
        />
        <br />
        Password check{" "}
        <InputWithLabel
          label="비밀번호 확인"
          name="passwordConfirm"
          onChange={onPasswordCheckHandler}
          placeholder="비밀번호 확인하세요."
          type="password"
        />
        <br />
        <button type="submit" variant="contained" onClick={onSubmitHandler}>
          회원가입
        </button>
      </AuthContent>
    </div>
  );
}
