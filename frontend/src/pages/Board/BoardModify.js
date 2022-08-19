import axios from "axios";
import Quill from "quill";
import {  useRef, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styled from 'styled-components';
import palette from '../../components/common/Write/palette';
import Responsive from '../../components/common/Write/Responsive';
import React from 'react';
import Button from "../../components/common/Write/Button"
import ArrowBackIosNewRoundedIcon from '@mui/icons-material/ArrowBackIosNewRounded';
import AccountCircleRoundedIcon from '@mui/icons-material/AccountCircleRounded';
import styles from "./Board.module.css";

const EditorBlock = styled(Responsive)`
  /* 페이지 위아래 여백 지정 */
  // padding-top: 1rem;
  // padding-bottom: 1rem;
  // background-color: red;
  // padding:0;
  font-family: 'Noto Sans KR', sans-serif;
  width: 100%;
`;

const TitleInput = styled.input`
  font-size: 20px;
  padding: 10px;
  padding-left: 15px;
  margin-top: 20px;
  border-radius: 10px;
  border: 1px solid ${palette.gray[4]};
  width: 100%;
  font-weight: 500;
`;

const QuillWrapper = styled.div`
  width: 100%;
  margin-top: 10px;
  border-radius: 10px;
  border: 1px solid ${palette.gray[4]};
  /* 최소 크기 지정 및 padding 제거 */
  .ql-editor {
    min-height: 300px;
    max-height: 500px;
    font-size: medium;
  }
//   .ql-editor::-webkit-scrollbar {
//     width: 10px;
// }
//   .ql-editor::-webkit-scrollbar-track {
//       background-color: rgba(0, 0, 0, 0.1);
//       border-radius: 10px;
//   }
//   .ql-editor::-webkit-scrollbar-thumb {
//       background-color: #A27B5C;
//       border-radius: 10px;
//   }
  // .ql-editor.ql-blank::before {
  //   left: 0px;
  // }
`;

const WriteActionButtonsBlock = styled.div`
  margin-top: 25px;
  text-align: center;
  button + button {
    margin-left: 10px;
  }
`;

const BoardModify = ({ onCancel, onPublish, isEdit }) => {
  const quillElement = useRef(null); // Quill을 적용할 DivElement를 설정
  const quillInstance =  useRef(null); // Quill 인스턴스를 설정
  const [nickname, setNickname] = useState();
  const [boardContent, setBoardContent] = useState("");
  const [boardTitle, setBoardTitle] = useState("");
  const [id, setId] = useState();
  
  let navigate = useNavigate();
  let location = useLocation();
  let boardId = location.state.boardId;

  useEffect(() => {
    quillInstance.current = new Quill(quillElement.current, {
      theme: 'bubble',
    //   placeholder: '내용을 작성 후 드래그시 다양한 수정이 가능합니다.' ,
      modules: {
        toolbar: [
          [{ header: '1' }, { header: '2' }],
          ['bold', 'italic', 'underline', 'strike'],
          [{ list: 'ordered' }, { list: 'bullet' }],
          ['blockquote', 'code-block', 'link', 'image'],
        ],
      },
    });

    axios
      .get("/api/user", {
        headers : {
            Authorization: window.localStorage.accessToken,
            "Content-Type": "application/json",
        },
      })
      .then((response) => {
        setNickname(response.data.userNickname);
      })
      .catch((error) => {
        console.log(error);
      })

    axios
      .get("/api/board/" + boardId, {
        
        headers: {
          Authorization: window.localStorage.accessToken,
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        console.log("board 테스트" + JSON.stringify(response.data.boardTitle));
        setBoardTitle(response.data.boardTitle);
        setBoardContent(response.data.boardContent);
        setId(response.data.boardId);
        quillInstance.current.setText(response.data.boardContent)
      })
      .catch((error) => {
        console.log(error);
      });
  },  
   
  []);

  function onPublish() {
    axios
      .put("/api/board/"+boardId, 
      {
        boardContent : quillInstance.current.getText(),
        boardTitle : boardTitle,
        boardId : id,
      },
      {
        headers: {
          Authorization: window.localStorage.accessToken,
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        console.log(response.data);
        navigate("/lobby/board", {state : {boardId:response.data.boardId}})
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function onCancel() {
    navigate("/lobby/board")
  }
  function title (e) { 
    setBoardTitle(e.target.value);
  }
    return (
        <EditorBlock>
        {/* <p>작성자 : {nickname}</p> */}
        <TitleInput required onChange={title} value={boardTitle}/>
        <QuillWrapper>
          <div ref={quillElement} />
        </QuillWrapper>
        <WriteActionButtonsBlock>
        <button cyan className={styles.btn} onClick={onPublish}> 
          {'수정'}
        </button>
        <button onClick={onCancel} className={styles.btn}>취소</button>
      </WriteActionButtonsBlock>
      </EditorBlock>
    )
};

export default BoardModify;