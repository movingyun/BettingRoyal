import React from "react"
import axios from "axios";
import { useEffect, useState } from "react";
import Link from '@mui/material/Link';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

function createData(id, date, nickname, hit, title) {
    return { id, date, nickname, hit, title };
  }
  
  const rows = [
    createData(
      0,
      '16 Mar, 2019',
      'Elvis Presley',
      'Tupelo, MS',
      'VISA ⠀•••• 3719',
      312.44,
    ),
    createData(
      1,
      '16 Mar, 2019',
      'Paul McCartney',
      'London, UK',
      'VISA ⠀•••• 2574',
      866.99,
    ),
    createData(2, '16 Mar, 2019', 'Tom Scholz', 'Boston, MA', 'MC ⠀•••• 1253', 100.81),
    createData(
      3,
      '16 Mar, 2019',
      'Michael Jackson',
      'Gary, IN',
      'AMEX ⠀•••• 2000',
      654.39,
    ),
    createData(
      4,
      '15 Mar, 2019',
      'Bruce Springsteen',
      'Long Branch, NJ',
      'VISA ⠀•••• 5919',
      212.79,
    ),
  ];
  
  function preventDefault(event) {
    event.preventDefault();
  }
  
  export default function Orders() {
    const [nickname, setNickname] = useState();

    useEffect(()=> {
      axios
      .get("/api/notice", {
        headers: {
          Authorization: window.localStorage.accessToken,
          "Content-Type": "application/json",
        },
      })
      .then((response)=> {
        console.log("공지사항 : " + JSON.stringify(response.data[0]));
      })
      .catch((error)=> {
        console.log(error);
      });


      axios
    .get("/api/user", { 
        headers: {
          Authorization: window.localStorage.accessToken,
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        console.log("nickname = " + JSON.stringify(response.data.userNickname));
        setNickname(response.data.userNickname);
      })
      .catch((error) => {
        console.log(error);
      });
    })

    return (
        <div >
      <React.Fragment>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>No.</TableCell>
              <TableCell>제목</TableCell>
              <TableCell>작성자</TableCell>
              <TableCell>작성일자</TableCell>
              <TableCell>조회수</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.id}>
                <TableCell>{row.date}</TableCell>
                <TableCell>{row.nickname}</TableCell>
                <TableCell>{row.hit}</TableCell>
                <TableCell>{row.title}</TableCell>
                <TableCell>{row.title}</TableCell>
                {/* <TableCell>{row.paymentMethod}</TableCell> */}
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Link color="primary" href="#" onClick={preventDefault} sx={{ mt: 3 }}>
          글쓰기
        </Link>
      </React.Fragment>
      </div>
    );
  }
