import React, { useState, useEffect } from "react";

const useAudio = (url, starting, loopping) => {
  const [audio] = useState(new Audio(url));
  const [playing, setPlaying] = useState(false);

  const toggle = () => {
    setPlaying(!playing);
  }
  useEffect(() => {
    // audio.muted = true
    // audio.muted = false
    audio.volume = 0.1;
    playing ? audio.play() : audio.pause();
    audio.loop = true
  },[playing]);

  useEffect(() => {
    audio.addEventListener('ended', () => setPlaying(false));
    return () => {
      audio.removeEventListener('ended', () => setPlaying(false));
    };
  }, []);

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