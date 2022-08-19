import React, { useEffect, useState } from "react";
import * as faceapi from "face-api.js";
import "./OvVideo.module.css";
import { Radar, RadarChart, PolarGrid, Legend, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';

function App(props) {
  const startCamera = () => {
    const video = document.getElementById("video");


    navigator.getUserMedia(
      {
        video: {},
      },
      (stream) => (video.srcObject = stream),
      (err) => console.log(err)
    );
  };
  // const [data, setDate] = useState([
  //   {subject: 'angry', A:100, fullMark: 150},
  //   {subject: 'fearful', A:100, fullMark: 150},
  //   {subject: 'happy', A:100, fullMark: 150},
  //   {subject: 'neutral', A:100, fullMark: 150},
  //   {subject: 'sad', A:100, fullMark: 150},
  //   {subject: 'suprised', A:100, fullMark: 150},
  // ]);
  const [streamManager, setStreamManager] = useState(props.streamManager);
  
  useEffect(() => {
  //   if (streamManager && !! this.video) {
      streamManager.addVideoElement(this.video.current);
  //   }
  }, [streamManager])

  useEffect(() => {

    const fetchModels = async () => {
      Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
        // faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
        // faceapi.nets.faceRecognitionNet.loadFromUri("/models"),
        faceapi.nets.faceExpressionNet.loadFromUri("/models"),
      ]).then(startCamera());
    };

    fetchModels();
    const video = document.getElementById("video");

    video.addEventListener("play", () => {
      // const canvas = faceapi.createCanvasFromMedia(video);
      // document.body.append(canvas);
      // const boxSize = {
      //   width: video.width,
      //   height: video.height,
      // };

      // faceapi.matchDimensions(canvas, boxSize);

      setInterval(async () => {
        //async
        // await
        const detections = await faceapi
          .detectSingleFace(video, new faceapi.TinyFaceDetectorOptions())
          // .withFaceLandmarks()
          .withFaceExpressions();

        // canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
        // const resizedDetections = faceapi.resizeResults(detections, boxSize);

        // faceapi.draw.drawDetections(canvas, resizedDetections);

        // faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);

        // faceapi.draw.drawFaceExpressions(canvas, resizedDetections);

        console.log(detections.expressions);
      }, 10000);
    });


  }, []);
  
  return (
    <div>
        <video id="video" autoPlay></video>
    </div>
  );
}

export default App;