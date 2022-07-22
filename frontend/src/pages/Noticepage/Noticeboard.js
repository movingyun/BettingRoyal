import { useEffect, useState } from "react";
import axios from "axios";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";

export default function Noticeboard() {
  useEffect(() => {}, []);
  
  let noticeboard = (
    <Grid container>
      공지사항
    </Grid>
  );

  return (
    <>
      <table>
        <thead>
          <tr>
            <th>글번호</th>
            <th>제목</th>
            <th>등록일</th>
            <th>조회수</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>1</td>
            <td>첫번째 게시글입니다.</td>
            <td>2020-10-25</td>
            <td>6</td>
          </tr>
          <tr>
            <td>2</td>
            <td>두번째 게시글입니다.</td>
            <td>2020-10-25</td>
            <td>5</td>
          </tr>
          <tr>
            <td>3</td>
            <td>세번째 게시글입니다.</td>
            <td>2020-10-25</td>
            <td>1</td>
          </tr>
          <tr>
            <td>4</td>
            <td>네번째 게시글입니다.</td>
            <td>2020-10-25</td>
            <td>2</td>
          </tr>
          <tr>
            <td>5</td>
            <td>다섯번째 게시글입니다.</td>
            <td>2020-10-25</td>
            <td>4</td>
          </tr>
        </tbody>
      </table>
    </>
  )
}
