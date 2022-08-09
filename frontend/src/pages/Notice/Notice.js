import React, {useEffect, useState, useRef} from "react";
import axios from "axios";

const Notice = () => {
    const [nickname, setNickname] = useState();

    return (
        // <div style={{marginLeft: '500px'}}>
        // 공지사항<br/>
        // <input type="text" placeholder="제목" className="" ></input>
        // </div>
        <div style={{marginLeft: '500px'}}>
            <h1>공지사항 목록</h1>
            <div>
                <table>
                <thead>
                    <tr>
                        <th>No.</th>
                        <th>제목</th>
                        <th>작성자</th>
                        <th>작성일자</th>
                        <th>조회수</th>
                        <th>좋아요수</th>
                    </tr>
                </thead>
                <tbody>
                    
                </tbody>
                </table>
            </div>
        </div>
    )
}

export default Notice