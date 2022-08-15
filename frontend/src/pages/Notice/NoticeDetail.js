import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styled from 'styled-components';
import palette from '../../components/common/Write/palette';
import Responsive from '../../components/common/Write/Responsive';
import React from 'react';
import Button from "../../components/common/Write/Button"

const PostViewerBlock = styled(Responsive)`
  margin-top: 3rem;
`;

const PostHead = styled.div`
  border-bottom: 1px solid ${palette.gray[2]};
  padding-bottom: 3rem;
  margin-bottom: 3rem;

  h1 {
    font-size: 3rem;
    line-height: 1.5;
    margin: 0;
  }
`;

const PostContent = styled.div`
  font-size: 1.1rem;
  color: ${palette.gray[8]};
`;

const WriteActionButtonsBlock = styled.div`
  margin-top: 1rem;
  margin-bottom: 3rem;
  button + button {
    margin-left: 0.5rem;
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
            <p>{id}번 째 공지사항</p>
            <h1>{noticeTitle}</h1>
            <p>작성자 : 관리자</p>
            <p>조회수 : {noticeHit}</p>
            <span>{new  Date(noticeDate).toLocaleDateString()}</span>
        </PostHead>
        <PostContent>
            <p>{noticeContent}</p>
        </PostContent>
        <br/>
        <WriteActionButtonsBlock>
            <StyledButton onClick={onCancel}>뒤로가기</StyledButton>
        </WriteActionButtonsBlock>
        </PostViewerBlock>
    )
};

export default BoardDetail;