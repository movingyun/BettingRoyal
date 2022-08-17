import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styled from 'styled-components';
import palette from '../../components/common/Write/palette';
import Responsive from '../../components/common/Write/Responsive';
import React from 'react';
import Button from "../../components/common/Write/Button"
import ArrowBackIosNewRoundedIcon from '@mui/icons-material/ArrowBackIosNewRounded';
import AccountCircleRoundedIcon from '@mui/icons-material/AccountCircleRounded';
import styles from "./Board.module.css";
import { Routes, Route, Link } from "react-router-dom";
import BoardModify from "./BoardModify";

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

const BoardDetail =({isEdit}) => {
    const [nickname, setNickname] = useState();
    const [boardTitle, setBoardTitle] = useState();
    const [boardContent, setBoardContent] = useState();
    const [boardHit, setBoardHit] = useState();
    const [boardDate, setBoardDate] = useState();
    const [boardLike, setBoardLike] = useState();
    const [id, setId] = useState();
    const [myNickname, setmyNickname] = useState();

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

        axios
        .get("/api/user", {
          headers: {
            Authorization: window.localStorage.accessToken,
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          setmyNickname(response.data.userNickname);
        })
        .catch((error) => {
          console.log(error);
        });
    },[])

    function onCancel() {
        axios
        .delete("/api/board", {
        headers: {
            Authorization: window.localStorage.accessToken,
            "Content-Type": "application/json",
        },
        data: {
            boardId : id,
        },
        })
        .then((request) => {
        console.log("test:"+request.data);
        })
        .catch((error) => {
            console.log(error);
        });
        navigate("/lobby/board");
    }

    function goBack(){
        navigate("/lobby/board")
    }

    function onModify(e){
        navigate("/lobby/board/modify" , {state: { boardId:e.id } })
    }
    
    return (
        <PostViewerBlock>
        <PostHead>
            <div className={styles.back} onClick={goBack}><ArrowBackIosNewRoundedIcon sx={{ fontSize: 18, mr:0.5, mb:0.4 }} />뒤로가기</div>
            {/* <button onClick={onCancel}>테스트</button> */}
            { myNickname==nickname && <button className={styles.smallBtn} onClick={onCancel}>
                {'삭제'}
            </button>}
            { myNickname==nickname && <button className={styles.smallBtn} cyan onClick={onModify}>
                {'수정'}
            </button>}
            <h1>{boardTitle}</h1>
            <div className={styles.postInfo}>
              <div className={styles.infoLeft}><AccountCircleRoundedIcon sx={{ fontSize: 22, mr:0.5, mb:0.4 }}/><strong>{nickname}</strong>&nbsp;&nbsp;|&nbsp;&nbsp;{new  Date(boardDate).toLocaleDateString()}</div>
              <div className={styles.infoRignt}>조회수&nbsp;<strong>{boardHit}</strong>&nbsp;&nbsp;좋아요&nbsp;<strong>{boardLike}</strong></div>
            </div>
        </PostHead>
        <PostContent>
            <p>{boardContent}</p>
        </PostContent>
        <br/>
        <WriteActionButtonsBlock>
        </WriteActionButtonsBlock>
        <PostHead>
          댓글 쓸부분
        </PostHead>
            {/* <Routes>
                 <Route path="modify" element={<BoardModify />} />
            </Routes> */}
        </PostViewerBlock>
    )
};

export default BoardDetail;