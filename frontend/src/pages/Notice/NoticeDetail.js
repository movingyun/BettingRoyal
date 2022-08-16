import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styled from 'styled-components';
import palette from '../../components/common/Write/palette';
import Responsive from '../../components/common/Write/Responsive';
import React from 'react';
import Button from "../../components/common/Write/Button"
import styles from "./Notice.module.css";
import ArrowBackIosNewRoundedIcon from '@mui/icons-material/ArrowBackIosNewRounded';
import AccountCircleRoundedIcon from '@mui/icons-material/AccountCircleRounded';

const PostViewerBlock = styled(Responsive)`
font-family: 'Noto Sans KR', sans-serif;
border: 1px solid ${palette.gray[4]};
width: 100%;
border-radius: 10px;
padding:0
`;

const PostHead = styled.div`
padding:20px;
border-bottom: 1px solid ${palette.gray[4]};
background-color: #f7f3e9;
border-top-left-radius: 10px;
border-top-right-radius: 10px;
h1 {
  font-size: 25px;
  margin-top: 10px;
  margin-bottom: 12px;
  font-weight: 600;
}
`;

const PostContent = styled.div`
padding:20px;
`;

const WriteActionButtonsBlock = styled.div`
margin-top: 25px;
text-align: center;
button + button {
  margin-left: 10px;
}
`;

// TagBox에서 사용하는 버튼과 일차하는 높이로 설정한 후 서로 간의 여백 지정
const StyledButton = styled(Button)`
  height: 2.125rem;
  & + & {
    margin-left: 0.5rem;
  }
`;

const BoardDetail =({isEdit}) => {
    const [noticeTitle, setNoticeTitle] = useState();
    const [noticeContent, setNoticeContent] = useState();
    const [noticeHit, setNoticeHit] = useState();
    const [noticeDate, setNoticeDate] = useState();
    const [id, setId] = useState();

    let navigate = useNavigate();
    let location = useLocation();
    let noticeId = location.state.noticeId;


    console.log()
    useEffect(()=> {
        axios
        .get("/api/notice/"+noticeId, {
            headers: {
                Authorization: window.localStorage.accessToken,
                "Content-Type": "application/json",
            },
        })
        .then((response)=>{
            console.log("board" + JSON.stringify(response.data));
            setNoticeTitle(response.data.noticeTitle);
            setNoticeContent(response.data.noticeContent);
            setNoticeDate(response.data.noticeDate);
            setNoticeHit(response.data.noticeHit);
            setId(response.data.noticeId);
        })
        .catch((error)=> {
            console.log(error);
        });
    },[])

    function onCancel() {
        navigate("/lobby/notice")
    }

    function onModify(){
        navigate("/lobby/notice")
    }
    
    return (
        <PostViewerBlock>
        <PostHead>
        <div className={styles.back} onClick={onCancel}><ArrowBackIosNewRoundedIcon sx={{ fontSize: 18, mr:0.5, mb:0.4 }} />뒤로가기</div>
            <h1>{noticeTitle}</h1>
            <div className={styles.postInfo}>
              <div className={styles.infoLeft}><AccountCircleRoundedIcon sx={{ fontSize: 22, mr:0.5, mb:0.4 }}/><strong>관리자</strong>&nbsp;&nbsp;|&nbsp;&nbsp;{new  Date(noticeDate).toLocaleDateString()}</div>
              <div className={styles.infoRignt}>조회수&nbsp;<strong>{noticeHit}</strong></div>
            </div>
        </PostHead>
        <PostContent>
            <p>{noticeContent}</p>
        </PostContent>
        </PostViewerBlock>
    )
};

export default BoardDetail;