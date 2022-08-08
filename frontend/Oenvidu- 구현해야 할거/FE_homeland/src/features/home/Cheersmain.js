import { useEffect, useState } from 'react';
import Cheers from './Cheers'
import Timeout from './Timeout'
import './Cheers.css'

function Main() {
  let [open,Setopen] = useState(true)
  useEffect(()=>{
    setTimeout(() => {console.log("세 번째 메시지")
    Setopen(false)
  
  }, 3900);

  },[open])
  // open값바뀌면 실행
// 처음에 타이머,그담에 짠효과 


  return (
    <>

 <div className="App">
    {
      open === true
      ?(<div className='ch2'>
      <div className="h">
        <div className="chbox">
          <div className="zoom-in-out-box">
            <Timeout></Timeout></div></div></div></div>
      
      )
      :(<div className="chbox"><Cheers></Cheers> </div> )
    }
    </div>

   

    </>
    
  );
}

export default Main;
