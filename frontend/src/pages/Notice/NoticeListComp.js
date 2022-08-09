import React, { Component } from 'react';
import {useEffect, useState} from "react";
import axios from "axios";
import { useSearchParams } from 'react-router-dom';


const NoticeListComp = () => {
    const [pageCnt, setPageCnt] = useState(0);
    const [boardList, setBoardList] = useState([]);
    const [searchParams, SetSearchParams] = useSearchParams();

    useEffect(() => {
        const getBoardList = async() => {
            const pageNum = searchParams.get("page");
        }

        getBoardList().then(result => setBoardList(result));
        const getTotalBoard = async () => {
        }
    })

    return (
        <div>
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