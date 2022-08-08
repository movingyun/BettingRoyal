import { useEffect, useState } from "react";

// export default function Chat(){
export default function Chat(props){

  const onKeyPress=(e)=> {
    if(e.key ==='Enter'){
      const msg = e.target.value
      props.sendChat(msg);
      e.target.value = ''
    }
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
    <div>
      <p>CHAT</p>
      <div>
        {props.chatList.map((data, idx) => (
          <p>
            {data.name} : {data.msg}
          </p>
        ))}
      </div>
      <div>
          <input type={"text"} id={"chatTxt"} onKeyPress={onKeyPress} placeholder='메세지'></input>
      </div>
    </div>
  )
}
