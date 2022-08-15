import React, { useRef, useEffect, useState } from "react";
import Quill from "quill";
import 'quill/dist/quill.bubble.css';
import styled from "styled-components";
import palette from "../../components/common/Write/palette";
import Responsive from "../../components/common/Write/Responsive";
import axios from "axios";
import { useNavigate} from "react-router-dom";
import Button from "../../components/common/Write/Button"

const EditorBlock = styled(Responsive)`
  /* 페이지 위아래 여백 지정 */
  padding-top: 1rem;
  padding-bottom: 1rem;
`;

const TitleInput = styled.input`
  outline: none;
  border: none;
  font-size: 2rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid ${palette.gray[4]};
  margin-bottom: 2rem;
  @media (max-width: 1024px) {
    width: 768px;
  }
  @media (max-width: 768px) {
    width: 100%;
  }
`;

const QuillWrapper = styled.div`
  /* 최소 크기 지정 및 padding 제거 */
  .ql-editor {
    padding: 0;
    min-height: 320px;
    font-size: 1.125rem;
    line-height: 1.5;
  }
  .ql-editor.ql-blank::before {
    left: 0px;
  }
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
    console.log("확인 : "+boardContent);
    console.log("2222 :  "+boardTitle);
    console.log("Content  :"+quillInstance.current.getContents());
    console.log("tet :"+quillInstance.current.getText());
    
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
      <p>작성자 : {nickname}</p>
      <TitleInput required placeholder="제목을 입력하세요." onChange={title}/>
      <QuillWrapper>
        <div ref={quillElement} />
      </QuillWrapper>

      <WriteActionButtonsBlock>
      <StyledButton cyan onClick={onPublish}>
        {isEdit ? '수정' : '등록'}
      </StyledButton>
      <StyledButton onClick={onCancel}>취소</StyledButton>
    </WriteActionButtonsBlock>
    </EditorBlock>
  );
};

export default Editor;