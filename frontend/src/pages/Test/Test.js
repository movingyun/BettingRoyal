import styles from "./Test.module.css";
import React, { useState, useCallback } from "react";
  
function Test() {

	//오디오
	const [stream, setStream] = useState();
	const [media, setMedia] = useState();
	const [onRec, setOnRec] = useState(true);
	const [source, setSource] = useState();
	const [analyser, setAnalyser] = useState();
	const [audioUrl, setAudioUrl] = useState();
	const [disabled, setDisabled] = useState(true);
  
	const onRecAudio = () => {
  
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
  
	const offRecAudio = () => {
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

	const startVideo = () => {
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

	const stopVideo = () => {
		setPlaying(false);
		let video = document.getElementsByClassName('vid')[0];
		video.srcObject.getTracks()[0].stop();
	};

	return (
		<div className={styles.app} style={{marginLeft: '250px'}}>
			<div>
				<video
					muted
					autoPlay
					className={styles.vid}
				></video>
			</div>
			<div>
				{playing ? (
					<button onClick={stopVideo}>중지</button>
				) : (
					<button onClick={startVideo}>테스트</button>
				)}
			</div>
			<button onClick={onRec ? onRecAudio : offRecAudio}>녹음</button>
     		<button onClick={play} disabled={disabled}>재생</button>
		</div>
	);
}

export default Test;
