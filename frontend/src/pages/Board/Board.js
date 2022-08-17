import { Routes, Route, Link } from "react-router-dom";
import BoardList from "./BoardList";
import BoardWrite from "./BoardWrite";
import BoardDetail from "./BoardDetail";
import BoardModify from "./BoardModify";

export default function Board() {
    return (
    <Routes>
        <Route path="/" element={<BoardList />} />
        <Route path="boardwrite" element={<BoardWrite />} />
        <Route path="detail/*" element={<BoardDetail />} />
        <Route path="modify/*" element={<BoardModify />} />
    </Routes>
    );
}