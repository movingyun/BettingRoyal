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
    const [nickname, setNickname] = useState();
    const [boardTitle, setBoardTitle] = useState();
    const [boardContent, setBoardContent] = useState();
    const [boardHit, setBoardHit] = useState();
    const [boardDate, setBoardDate] = useState();
    const [boardLike, setBoardLike] = useState();
    const [id, setId] = useState();

    let navigate = useNavigate();
    let location = useLocation();
    let boardId = location.state.boardId;


    console.log()
    useEffect(()=> {
        axios
        .get("/api/board/"+boardId, {
            headers: {
                Authorization: window.localStorage.accessToken,
                "Content-Type": "application/json",
            },
        })
        .then((response)=>{
            console.log("board" + JSON.stringify(response.data));
            setBoardTitle(response.data.boardTitle);
            setBoardContent(response.data.boardContent);
            setNickname(response.data.userNickname);
            setBoardDate(response.data.boardDate);
            setBoardHit(response.data.boardHit);
            setBoardLike(response.data.boardLike);
            setId(response.data.boardId);
        })
        .catch((error)=> {
            console.log(error);
        });
    },[])

    function onCancel() {
        navigate("/lobby/board")
    }

    function onModify(){
        navigate("/lobby/board")
    }
    
    return (
        <PostViewerBlock>
        <PostHead>
            <p>{id}번 째 게시물</p>
            <h1>{boardTitle}</h1>
            <p>작성자 : {nickname}</p>
            <p>조회수 : {boardHit}</p>
            <p>좋아요 수 : {boardLike}</p>
            <span>{new  Date(boardDate).toLocaleDateString()}</span>
        </PostHead>
        <PostContent>
            <p>{boardContent}</p>
        </PostContent>
        <br/>
        <WriteActionButtonsBlock>
            <StyledButton cyan onClick={onModify}>
                {'수정'}
            </StyledButton>
            <StyledButton onClick={onCancel}>뒤로가기</StyledButton>
        </WriteActionButtonsBlock>
        <>------------------------------</>
        <PostHead>
          댓글 쓸부분
        </PostHead>
        </PostViewerBlock>
    )
};

export default BoardDetail;