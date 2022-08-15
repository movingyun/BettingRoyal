import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const BoardDetail =() => {
    const [nickname, setNickname] = useState();
    const [boardTitle, setBoardTitle] = useState();
    const [boardContent, setBoardContent] = useState();
    const [boardHit, setBoardHit] = useState();
    const [boardDate, setBoardDate] = useState();

    let navigate = useNavigate();
    let location = useLocation();
    let boardId = location.state.boardId;


    console.log(this.href)
    useEffect(()=> {
        axios
        .get("/api/board/{boardId}", {
            headers: {
                Authorization: window.localStorage.accessToken,
                "Content-Type": "application/json",
            },
        })
        .then((response)=>{
            console.log("테스트" + JSON.stringify(response.data));
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
        .then((response)=>{
            console.log("테스트" + JSON.stringify(response.data.userNickname));
            setNickname(response.data.userNickname);
        })
        .catch((error)=> {
            console.log(error);
        });
    })
    
    return (
        <div>
            <p>test</p>
            
        </div>
    )
};

export default BoardDetail;