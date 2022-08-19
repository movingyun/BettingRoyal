import React, { Component } from 'react';
import styles from './OvVideo.module.css';
import * as faceapi from "face-api.js";

export default class OpenViduVideoComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            expressions: undefined,
        };
        this.videoRef = React.createRef();
        this.faceapiInterval = this.faceapiInterval.bind(this);



        Promise.all([
            faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
            // faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
            // faceapi.nets.faceRecognitionNet.loadFromUri("/models"),
            faceapi.nets.faceExpressionNet.loadFromUri("/models"),
          ]).then(() => {
            // console.log(faceapi.nets);
          });
      
          setInterval(this.faceapiInterval, 5000);//.then(()=>{console.log(this.state.expressions)});
        //   this.props.updateExpressions(this.state.expressions)
        }
    


    async faceapiInterval() {
        const detections = await faceapi
        .detectSingleFace(
            this.videoRef.current,
            new faceapi.TinyFaceDetectorOptions()
        )
        // .withFaceLandmarks()
        .withFaceExpressions();

        // console.log(detections.expressions)
        // this.setState({expressions:detections.expressions})
        this.props.updateExpressions(detections.expressions);

      }
    


    componentDidUpdate(props) {
        if (props && !!this.videoRef) {
            this.props.streamManager.addVideoElement(this.videoRef.current);
        }
    }

    componentDidMount() {
        if (this.props && !!this.videoRef) {
            this.props.streamManager.addVideoElement(this.videoRef.current);
        }
    }

    render() {
        return <video autoPlay={true} ref={this.videoRef} className={styles.camera}/>;
    }

}
