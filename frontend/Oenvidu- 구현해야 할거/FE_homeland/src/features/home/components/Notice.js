/* eslint-disable */
// import axios from 'axios';
import { useState } from "react";
import { Table, Pagination, Button } from "react-bootstrap";
import "./Notice.css";
import { Link } from "react-router-dom";
import Login from "./Login";

function Notice() {
  const active = 2;
  let items = [];
  for (let number = 1; number <= 5; number++) {
    items.push(
      <Pagination.Item key={number} active={number === active}>
        {number}
      </Pagination.Item>
    );
  }
  return (
    <div className="mt-3">
      <h1>공지사항입니다.</h1>
      <Table className="my-3 container" striped bordered hover>
        <thead>
          <tr>
            <th>No</th>
            <th>제목</th>
            <th>등록일</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>1</td>
            <td>Mark</td>
            <td>@mdo</td>
          </tr>
          <tr>
            <td>2</td>
            <td>Jacob</td>
            <td>@fat</td>
          </tr>
          <tr>
            <td>3</td>
            <td>Larry the Bird</td>
            <td>@twitter</td>
          </tr>
        </tbody>
      </Table>
      <Pagination>{items}</Pagination>
      <Link to="/login">
        <Button>글 작성</Button>
      </Link>
    </div>
  );
}

export default Notice;
