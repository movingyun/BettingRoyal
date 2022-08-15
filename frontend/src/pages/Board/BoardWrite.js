import { Grid } from "@material-ui/core";
import { Button } from "@mui/material";
import { Link } from "react-router-dom";
import BoardEditor from "./BoardEditor";
import Responsive from "../../components/common/Write/Responsive";
import WriteActionButtons from "../../components/common/Write/WriteActionButtons";

const BoardWrite =() => {
    return (
        <Responsive>
            <p>📌 게시판 글쓰기</p>
            <BoardEditor />
        </Responsive>
    )
};

export default BoardWrite;