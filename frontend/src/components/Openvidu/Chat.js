import { useEffect, useState } from "react";
import styles from './Chat.module.css';
import React from "react";
import ReactScrollableFeed from "react-scrollable-feed"

// export default function Chat(){
export default function Chat(props){

  const onKeyPress=(e)=> {
    if(e.key ==='Enter'){
      const msg = e.target.value
      props.sendChat(msg);
      e.target.value = ''
    }
  }

  function send() {
      const msg = document.getElementById('chatTxt').value
      console.log(msg);
      props.sendChat(msg);
      document.getElementById('chatTxt').value = ''
  }

  // const [chatList, setChat] = useState(props.chatList);

  // useEffect(() => {
  //   // axios.get("http://").then((playersdata) => {
  //   //   setPlayers(playersdata);
  //   // });
  //   setChat(props.chatList)
  //   console.log("12312312312312312"+props.chatList)
  // });

  return (
    <div className={styles.chat}>
      <div className={styles.chatList}>
        <ReactScrollableFeed >
        {props.chatList.map((data, idx) => (
          <p className={styles.chatLine} >
            {data.name} : {data.msg}
          </p>
        ))}
        </ReactScrollableFeed>
      </div>
      <div className={styles.inputList}>
          <input className={styles.input} type={"text"} id={"chatTxt"} onKeyPress={onKeyPress} placeholder='메시지 보내기'></input>
          <button className={styles.inputBtn} type={"button"} onClick={send}>전송</button>
      </div>
    </div>
  )
}
