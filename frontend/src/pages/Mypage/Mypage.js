import React from 'react';
import styles from "./Mypage.module.css";

const Mypage = () => {
    return (
        <div className={styles.container}>
            <div>
            <h3>내 정보</h3>
            <div class="row">
                <div class="column">닉네임</div>
                <div class="column">이메일</div>
                <div class="column">성별</div>
            </div>
            <button>닉네임 변경</button>
            <button>비밀번호 변경</button>
        </div>
        <div>
            <h3>배지</h3>
            배지정보
        </div>
        <div>
            <h3>통계</h3>
            승률정보
        </div>
        </div>
    )
}

export default Mypage