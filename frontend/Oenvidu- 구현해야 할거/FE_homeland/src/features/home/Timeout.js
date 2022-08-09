import React, { useState, useEffect } from "react";
// import "./styles.css";
import './Cheers.css'
export default function App() {
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState('3');

  useEffect(() => {
    const countdown = setInterval(() => {
      if (parseInt(seconds) > 0) {
        setSeconds(parseInt(seconds) - 1);
      }
      if (parseInt(seconds) === 0) {
        if (parseInt(minutes) === 0) {
          clearInterval(countdown);
        } else {
          setMinutes(parseInt(minutes) - 1);
          setSeconds(59);
        }
      }
    }, 1000);
    return () => clearInterval(countdown);
  }, [minutes, seconds]);

  return (
    <div >
      {/* <h1>CountDown!</h1>/ */}
      <div className="dh3">
          {seconds < 10 ? `${seconds}` : seconds}
          {/* {minutes}:{seconds < 10 ? `0${seconds}` : seconds} */}

        
      </div>
    </div>
  );
}
