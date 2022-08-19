import { Routes, Route, Link } from "react-router-dom";
import NoticeList from "./NoticeList";
import NoticeDetail from "./NoticeDetail";


export default function Notice() {
    return (
    <Routes>
        <Route path="/" element={<NoticeList />} />
        <Route path="detail" element={<NoticeDetail />} />
    </Routes>
    );
}