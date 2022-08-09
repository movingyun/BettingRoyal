/* eslint-disable */
import { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import axios from "axios";
import dayjs from "dayjs";
import "./NoticeDetailPage.css";
import "dayjs/locale/ko";
import { Container, InputGroup } from "react-bootstrap";

dayjs.locale("ko");

function NoticeDetailPage() {
  const BEUrl = process.env.REACT_APP_BACKEND_URL;

  const history = useHistory();
  const [notice, setNotice] = useState([]);
  const { id } = useParams();
  const [userAuthority, setUserAuthority] = useState("");
  const token = localStorage.getItem("jwt");
  const setToken = () => {
    const config = {
      Authorization: `Bearer ${token}`,
    };
    return config;
  };

  const goToEditNotice = (event) => {
    event.preventDefault();
    history.push(`/notice-edit/${id}`);
  };

  const goToNoticeList = (event) => {
    event.preventDefault();
    history.push("/notice");
  };

  const getAuthority = () => {
    if (token) {
      axios({
        url: `${BEUrl}/api/v1/users/check-authority`,
        method: "get",
        headers: setToken(),
      }).then((res) => {
        setUserAuthority(res.data);
      });
    }
  };
  const getNotice = () => {
    axios({
      url: `${BEUrl}/api/v1/notice/${id}`,
      method: "get",
    })
      .then((res) => {
        setNotice(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(getNotice, [BEUrl, id]);
  useEffect(getAuthority, []);

  const onDeleteNotice = (event) => {
    event.preventDefault();
    axios({
      url: `${BEUrl}/api/v1/notice/${id}`,
      method: "delete",
      headers: setToken(),
    })
      .then(() => {
        history.push("/notice");
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <div className="notice-detail-font-style" style={{ paddingTop: "100px" }}>
      <h1
        className="my-3"
        style={{ color: "#353f71", fontSize: "50px", fontWeight: "600" }}
      >
        {notice.title}
      </h1>
      <div className="container notice-detail mt-5">
        <div className="d-flex justify-content-end">
          <p>{dayjs(notice.updatedAt).format("YYYY. MM. DD HH:mm")}</p>
        </div>
        <br />
        <br />
        <div className="notice-content">{notice.content}</div>
      </div>
      {userAuthority === "admin" ? (
        <div className="d-flex justify-content-center">
          <div
            style={{ width: "500px", Align: "center" }}
            className="my-3 d-flex justify-content-end"
          >
            <InputGroup className="d-flex justify-content-end">
              <button className="btn btn-color" onClick={goToEditNotice}>
                수정하기
              </button>
              <button className="btn btn-color" onClick={onDeleteNotice}>
                삭제하기
              </button>
            </InputGroup>
          </div>
        </div>
      ) : null}
      <button className="btn btn-color" onClick={goToNoticeList}>
        목록
      </button>
    </div>
  );
}

export default NoticeDetailPage;
