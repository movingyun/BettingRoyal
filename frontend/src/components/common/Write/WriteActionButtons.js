import React, { useState, useEffect  } from "react";
import styled from "styled-components";
import Button from "../../common/Write/Button"
import { useNavigate} from "react-router-dom";
import axios from "axios";

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

const WriteActionButtons = ({ onCancel, onPublish, isEdit }) => {
  const [boards, setBoards] = useState([]);
  const [boardContent, setBoardContent] = useState("");
  const [boardTitle, setBoardTitle] = useState("");
  const navigate = useNavigate();

  const onBoardContentHandler = (event) => {
    setBoardContent(event.currentTarget.value);
  };

  const onBoardTitleHandler = (event) => {
    setBoardTitle(event.currentTarget.value);
  };

  useEffect(() => {
    axios
      .get("/api/board", {
        headers: {
          Authorization: window.localStorage.accessToken,
        },
      })
      .then(function (response) {
        setBoards(makeBoardList(response.data));
      })
      .catch(function (error) {
        console.log(error);
      });
  }, []);

  function makeBoardList(boardsdata) {
    let list = [];
    for (let i = 0; i < boardsdata.length; i++) {
      let board = new Object();
      board.id = boardsdata[i].boardId;
      board.boardTitle = boardsdata[i].boardTitle;
      board.boardContent = boardsdata[i].boardContent;
      board.boardHit = boardsdata[i].boardHit+1;
      board.boardDate = boardsdata[i].boardDate;
      console.log(JSON.stringify(board));
      list.push(board);
    }
    return list;
  }

  function onPublish() {
    console.log("확인 : "+boardContent);
    console.log("2222 :  "+boardTitle);
    axios
      .post("/api/board", 
      {
        // body : JSON.stringify({
        //   boardContent : boardContent,
        //   boardTitle : boardTitle,
        // })
        boardContent : boardContent,
        boardTitle : boardTitle,
      },
      {
        headers: {
          Authorization: window.localStorage.accessToken,
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        console.log(response.data);
        setBoardContent(boardContent);
        setBoardTitle(boardTitle);
        navigate("/lobby/board", {state : {boardId:response.data.boardId}})
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function onCancel() {
    navigate("/lobby/board")
  }


  return (
    <WriteActionButtonsBlock>
      <StyledButton cyan onClick={onPublish}>
        {isEdit ? '수정' : '등록'}
      </StyledButton>
      <StyledButton onClick={onCancel}>취소</StyledButton>
    </WriteActionButtonsBlock>
  );
};

export default WriteActionButtons;