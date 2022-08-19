import styles from "./Test.module.css";
import React, { useState, useCallback } from "react";
import MicRoundedIcon from '@mui/icons-material/MicRounded';
import VideocamRoundedIcon from '@mui/icons-material/VideocamRounded';
  
function Test() {

	//오디오
	const [stream, setStream] = useState();
	const [media, setMedia] = useState();
	const [onRec, setOnRec] = useState(true);
	const [source, setSource] = useState();
	const [analyser, setAnalyser] = useState();
	const [audioUrl, setAudioUrl] = useState();
	const [disabled, setDisabled] = useState(true);
  
	const onAudio = () => {
  
	  setDisabled(true) 
	  
	  const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
	  const analyser = audioCtx.createScriptProcessor(0, 1, 1);
	  setAnalyser(analyser);
  
	  function makeSound(stream) {
		const source = audioCtx.createMediaStreamSource(stream);
		setSource(source);
		source.connect(analyser);
		analyser.connect(audioCtx.destination);
	  }

	  navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
		const mediaRecorder = new MediaRecorder(stream);
		mediaRecorder.start();
		setStream(stream);
		setMedia(mediaRecorder);
		makeSound(stream);
  
		analyser.onaudioprocess = function (e) {
		  // 30초 지나면 녹음 중지
		  if (e.playbackTime > 30) {
			stream.getAudioTracks().forEach(function (track) {
			  track.stop();
			});
			mediaRecorder.stop();
			analyser.disconnect();
			audioCtx.createMediaStreamSource(stream).disconnect();
  
			mediaRecorder.ondataavailable = function (e) {
			  setAudioUrl(e.data);
			  setOnRec(true);
			};
		  } else {
			setOnRec(false);
		  }
		};
	  });
	};
  
	const offAudio = () => {
	  media.ondataavailable = function (e) {
		setAudioUrl(e.data);
		setOnRec(true);
	  };
  
	  stream.getAudioTracks().forEach(function (track) {
		track.stop();
	  });

	  media.stop();
	  analyser.disconnect();
	  source.disconnect();
	  
	  if (audioUrl) {
		URL.createObjectURL(audioUrl);
	  }
	  
	  const sound = new File([audioUrl], "soundBlob", {
		lastModified: new Date().getTime(),
		type: "audio",
	  });
		
	  setDisabled(false);
	  console.log(sound);
	};
  
	const play = () => { 
	  const audio = new Audio(URL.createObjectURL(audioUrl));
	  audio.loop = false;
	  audio.volume = 1;
	  audio.play();
	};

	// 비디오
	const [playing, setPlaying] = useState(false);

	const onVideo = () => {
		setPlaying(true);
		navigator.getUserMedia(
			{
				video: true,
			},
			(stream) => {
				let video = document.getElementsByClassName('vid')[0];
				if (video) {
					video.srcObject = stream;
				}
			},
			(err) => console.error(err)
		);
	};

	const offVideo = () => {
		setPlaying(false);
		let video = document.getElementsByClassName('vid')[0];
		video.srcObject.getTracks()[0].stop();
	};

	return (
	<div className={styles.container} >
      <div className={styles.col}>
      <div className={styles.row}><h3 className={styles.title}><MicRoundedIcon sx={{ fontSize:20, mr:0.5, mb:0.4 }}/>마이크 테스트</h3></div>
      <hr/>
	    <div className={styles.center}>
				{onRec ? (
					<button onClick={onAudio} className={styles.button}>시작</button>
				) : (
					<button onClick={offAudio} className={styles.button}>완료</button>
				)}
        <button onClick={play} disabled={disabled} className={styles.button}>재생</button>
        </div>
      </div>

			<div className={styles.col}>
      <div className={styles.row}><h3 className={styles.title}><VideocamRoundedIcon sx={{ fontSize:20, mr:0.5, mb:0.4 }}/>카메라 테스트</h3></div>
	  <hr/>
		<div className={styles.center}>
          <video
            muted
            autoPlay
            className={`${'vid'} ${styles.video}`}
          ></video>
          <div>
            {playing ? (
              <button onClick={offVideo} className={styles.button}>중지</button>
            ) : (
              <button onClick={onVideo} className={styles.button}>시작</button>
            )}
          </div>
        </div>
			</div>
		</div>
	);
}

export default Test;
