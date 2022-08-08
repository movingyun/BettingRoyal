/* eslint-disable */
import axios from "axios";
import { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import "./Mypage.css";
import ProfileImage from "./image/profile_image.png";
import dayjs from "dayjs";
import "dayjs/locale/ko";

dayjs.locale("ko");

function Mypage() {
	const BEUrl = process.env.REACT_APP_BACKEND_URL;

  const [profile, setProfile] = useState([]);

  const getProfile = () => {
    axios({
      url: `${BEUrl}/api/v1/users/me`,
      method: "get",
      headers: setToken(),
    }).then((res) => {
      setProfile(res.data);
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
    <div className="font-style" style={{ paddingTop: "100px" }}>
      <h1 style={{ fontSize: "50px", fontWeight: "600" }}>마이페이지</h1>
      <Container className="mypage-form d-flex flex-column align-center">
        <div className="box" style={{ backgroundColor: "#BDBDBD" }}>
          <img className="profile" src={ProfileImage} />
        </div>
        <p className="p-margin">ID: {profile.userId}</p>
        <p className="p-margin">닉네임: {profile.nickname}</p>
        <p className="p-margin">이메일: {profile.email}</p>
        <p className="p-margin">
          가입일: {dayjs(profile.createdAt).format("YYYY년 MM월 DD일 HH:mm")}
        </p>
      </Container>
      <Link to="/editProfile">
        <button className="btn btn-color">내 정보 수정</button>
      </Link>
    </div>
  );
}

export default Mypage;
