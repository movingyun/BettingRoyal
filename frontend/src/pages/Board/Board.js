import { Routes, Route, Link } from "react-router-dom";
import BoardList from "./BoardList";
import BoardWrite from "./BoardWrite";
import Editor from "../../components/common/Write/Editor";
import BoardDetail from "./BoardDetail";
import BoardPostViewer from "./BoardPostViewer";

export default function Board() {
    return (
    <Routes>
        <Route path="/" element={<BoardList />} />
        <Route path="{boardId}" element={<BoardPostViewer />} />
        <Route path="boardwrite" element={<BoardWrite />} />
    </Routes>
    );
}