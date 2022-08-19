import React, { Component } from "react";

import * as faceapi from "face-api.js";
import { BarChart, Bar, XAxis, CartesianGrid, Tooltip } from "recharts";
import { Popup } from "semantic-ui-react";

export default class OpenViduVideoComponent extends Component {
  constructor(props) {
    super(props);
    this.videoRef = React.createRef(null);
    this.state = {
      topEmotion: "",
      data: [
        {
          // name: "neutral",
          name: "평온",
          uv: 0,
        },
        {
          // name: "happy",
          name: "기쁨",
          uv: 0,
        },
        {
          // name: "sad",
          name: "슬픔",
          uv: 0,
        },
        {
          // name: "angry",
          name: "화남",
          uv: 0,
        },
        // {
        //   // name: "fearful",
        //   name: "두려움",
        //   uv: 0,
        // },
        // {
        //   // name: "disgusted",
        //   name: "역겨움",
        //   uv: 0,
        // },
        {
          // name: "surprised",
          name: "놀람",
          uv: 0,
        },
      ],
      style: {
        height: 230,
        opacity: 0.7,
      },
    };

    this.onPlay = this.onPlay.bind(this);
    this.faceapiInterval = this.faceapiInterval.bind(this);

    Promise.all([
      faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
      faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
      faceapi.nets.faceRecognitionNet.loadFromUri("/models"),
      faceapi.nets.faceExpressionNet.loadFromUri("/models"),
    ]).then(() => {
      // console.log(faceapi.nets);
    });

    setInterval(this.faceapiInterval, 1000);
  }

  onPlay() {
    if (
      this.videoRef.current.paused ||
      this.videoRef.current.ended ||
      !faceapi.nets.tinyFaceDetector.params
    ) {
      setTimeout(() => this.onPlay());
      return;
    }
  }

  async faceapiInterval() {
    if (this.props.checkAlive) {
      const detections = await faceapi
        .detectAllFaces(
          this.videoRef.current,
          new faceapi.TinyFaceDetectorOptions()
        )
        .withFaceLandmarks()
        .withFaceExpressions();

      if (detections[0]) {
        let faces = detections[0].expressions;
        faces.neutral = faces.neutral * 0.5;
        faces.happy = faces.happy * 0.8;
        faces.angry = faces.angry * 5;
        faces.surprised = faces.surprised + faces.fearful;
        faces.sad = faces.sad + faces.disgusted;
        faces.sad = faces.sad * 5;

        const arrExp = Object.entries(detections[0].expressions);
        const valSort = Object.entries(detections[0].expressions).sort(
          ([, a], [, b]) => b - a
        );

        this.setState({
          topEmotion: valSort[0][0],
          data: [
            {
              name: "평온",
              uv: arrExp[0][1],
            },
            {
              name: "기쁨",
              uv: arrExp[1][1],
            },
            {
              name: "슬픔",
              uv: arrExp[2][1],
            },
            {
              name: "화남",
              uv: arrExp[3][1],
            },
            // {
            //   name: "두려움",
            //   uv: arrExp[4][1],
            // },
            // {
            //   name: "역겨움",
            //   uv: arrExp[5][1],
            // },
            {
              name: "놀람",
              uv: arrExp[6][1],
            },
          ],
        });
      }
    }
  }

  componentDidMount() {
    console.log("componentDidMount");
    if (this.props && !!this.videoRef) {
      this.props.streamManager.addVideoElement(this.videoRef.current);
    }
  }

  componentDidUpdate(props) {
    if (props && !!this.videoRef) {
      this.props.streamManager.addVideoElement(this.videoRef.current);
    }
  }

  componentWillUnmount() {}

  render() {
    return (
      <>
        <video
          autoPlay={true}
          ref={this.videoRef}
          className={this.props.isBlur ? "blured" : null}
        />
        <p></p>
        {this.props.checkAlive ? (
          <Popup
            trigger={
              <img
                src={`/img/${this.state.topEmotion}.png`}
                alt=""
                style={{
                  position: "absolute",
                  width: "100px",
                  top: "15%",
                  right: "5%",
                }}
              />
            }
            style={this.state.style}
            inverted
          >
            <BarChart
              width={350}
              height={200}
              data={this.state.data}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="name"
                style={{ fontSize: "20px" }}
                stroke="#8884d8"
              />
              <Tooltip />
              <Bar dataKey="uv" fill="#8884d8" />
            </BarChart>
          </Popup>
        ) : (
          <img
            src={`/img/dead.png`}
            alt=""
            style={{
              position: "absolute",
              width: "150px",
              top: "35%",
              right: "30%",
            }}
          />
        )}
      </>
    );
  }
}