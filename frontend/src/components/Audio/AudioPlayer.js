import React, { useState, useEffect } from "react";

const useAudio = (url, starting, loopping) => {
  const [audio] = useState(new Audio(url));
  const [playing, setPlaying] = useState(true);
  // const [loop, setLoop] = useState(loopping);
  // useEffect(() => {
  //   setTimeout(() => {
  //     setPlaying(true);
  //   }, 2000);
  //   // clearTimeout(a);
  // }, []);
  const toggle = () => {
    setPlaying(!playing);
    // setLoop(!loop);
  }
  useEffect(() => {
    // audio.muted = true
    // audio.muted = false
    audio.volume = 0.5;
    playing ? audio.play() : audio.pause();
    // if(loop===true){
      // setPlaying(true)
    // }
    audio.loop = true
  },[playing]);

  useEffect(() => {
    audio.addEventListener('ended', () => setPlaying(false));
    return () => {
      audio.removeEventListener('ended', () => setPlaying(false));
    };
  }, []);

  // setInterval(() => {
  //   console.log('here')
  //   setPlaying(true)
  // }, 1000);
  

  return [playing, toggle];
};

const Player = ({ url }) => {
  const [playing, toggle] = useAudio(url);

  return (
    <div>
      <button onClick={toggle}>{playing ? "Pause" : "Play"}</button>
    </div>
  );
};

export default Player;