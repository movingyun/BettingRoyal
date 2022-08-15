import React, { useRef, useEffect, useState } from "react";
import Quill from "quill";
import 'quill/dist/quill.bubble.css';
import styled from "styled-components";
import palette from "../../components/common/Write/palette";
import Responsive from "../../components/common/Write/Responsive";
import axios from "axios";
import { useNavigate} from "react-router-dom";
import Button from "../../components/common/Write/Button"
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

const Editor = ({ onCancel, onPublish, isEdit }) => {
  const quillElement = useRef(null); // Quill을 적용할 DivElement를 설정
  const quillInstance =  useRef(null); // Quill 인스턴스를 설정
  const [nickname, setNickname] = useState();
  const [boardContent, setBoardContent] = useState("");
  const [boardTitle, setBoardTitle] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    quillInstance.current = new Quill(quillElement.current, {
      theme: 'bubble',
      placeholder: '내용을 작성 후 드래그시 다양한 수정이 가능합니다.' ,
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
      .get("/api/board", {
        headers: {
          Authorization: window.localStorage.accessToken,
        },
      })
      .then(function (response) {
        // setBoards(makeBoardList(response.data));
      })
      .catch(function (error) {
        console.log(error);
      });
  },  
   
  []);

  function onPublish() {
    axios
      .post("/api/board", 
      {
        // body : JSON.stringify({
        //   boardContent : quillInstance.current.getText(),
        //   boardTitle : boardTitle,
        // })
        boardContent : quillInstance.current.getText(),
          boardTitle : boardTitle,
        // boardContent : boardContent,
        // boardTitle : boardTitle,
      },
      {
        headers: {
          Authorization: window.localStorage.accessToken,
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        console.log(response.data);
        // setBoardContent(boardContent);
        // setBoardTitle(boardTitle);
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
      <TitleInput required placeholder="제목" onChange={title}/>
      <QuillWrapper>
        <div ref={quillElement} />
      </QuillWrapper>
      <WriteActionButtonsBlock>
      <button cyan onClick={onPublish} className={styles.btn}>
        {isEdit ? '수정' : '등록'}
      </button>
      <button onClick={onCancel} className={styles.btn}>취소</button>
    </WriteActionButtonsBlock>
    </EditorBlock>
  );
};

export default Editor;