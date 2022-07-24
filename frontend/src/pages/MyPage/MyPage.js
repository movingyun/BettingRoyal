import  { useState } from "react";
import { Link } from "react-router-dom";

export default function MyPage() {

    // const MyPage = () => {
    //     const { user } = useUserState();
    // }

    return (
        <div>
        <Link to="/lobby/rooms">홈</Link>
        <div>
            <h1>내 정보</h1>
            <div class="row">
                <div class="column">닉네임</div>
                <div class="column">이메일</div>
                <div class="column">성별</div>
            </div>
            <button>닉네임 변경</button>
            <button>비밀번호 변경</button>
        </div>
        <div>
            <h1>배지</h1>
            배지정보
        </div>
        <div>
            <h1>통계</h1>
            승률정보
        </div>
        </div>
    );
}