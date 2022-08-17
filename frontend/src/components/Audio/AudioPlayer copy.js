import React, { useState, useEffect } from "react";

const useAudio = (url, starting, loopping) => {
  const [audio] = useState(new Audio(url));
  const [playing, setPlaying] = useState(starting);
  const [loop, setLoop] = useState(loopping);



  const toggle = () => {
    setPlaying(!playing);
    setLoop(!loop);
  }
  useEffect(() => {
    playing ? audio.play() : audio.pause();
    if(loop===true){
      setPlaying(true)
    }
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