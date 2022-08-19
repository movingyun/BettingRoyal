import { Grid } from "@material-ui/core";
import { Button } from "@mui/material";
import { Link } from "react-router-dom";
import BoardEditor from "./BoardEditor";
import Responsive from "../../components/common/Write/Responsive";
import WriteActionButtons from "../../components/common/Write/WriteActionButtons";
import styles from "./Board.module.css";
import CreateRoundedIcon from '@mui/icons-material/CreateRounded';

const BoardWrite =() => {
    return (
        <div>
            <div className={styles.title}><CreateRoundedIcon sx={{ fontSize: 20, mr:0.5, mb:0.4}}/>게시판 글작성</div>
            <BoardEditor />
        </div>
    )
};

export default BoardWrite;