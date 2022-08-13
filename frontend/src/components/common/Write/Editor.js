import React, { useRef, useEffect, useState } from "react";
import Quill from "quill";
import 'quill/dist/quill.bubble.css';
import styled from "styled-components";
import palette from "./palette";
import Responsive from "./Responsive";
import { Button } from "@mui/material";
import axios from "axios";

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

const Editor = () => {
  const quillElement = useRef(null); // Quill을 적용할 DivElement를 설정
  const quillInstance =  useRef(null); // Quill 인스턴스를 설정
  const [nickname, setNickname] = useState();

  useEffect(() => {
    quillInstance.current = new Quill(quillElement.current, {
      theme: 'bubble',
      placeholder: '내용을 작성 후 드래그시 다양한 수정이 가능합니다.' ,
      modules: {
        // 더 많은 옵션
        // https://quilljs.com/docs/modules/toolbar/ 참고
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
  }, []);

  return (
    <EditorBlock>
      <p>작성자 : {nickname}</p>
      <TitleInput required placeholder="제목을 입력하세요." />
      <QuillWrapper>
        <div ref={quillElement} />
      </QuillWrapper>
    </EditorBlock>
  );
};

export default Editor;