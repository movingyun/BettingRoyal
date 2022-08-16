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



      
        //   setInterval(this.faceapiInterval, 5000);
          //.then(()=>{console.log(this.state.expressions)});
        //   this.props.updateExpressions(this.state.expressions)
        }
    
    

    async faceapiInterval() {
            // console.log('here2')
            const detections = await faceapi

            .detectSingleFace(
                this.videoRef.current,
                new faceapi.TinyFaceDetectorOptions()
            )
            // .withFaceLandmarks()
            .withFaceExpressions() //.catch(() => {console.log("wait detection")});
            // console.log('here1')
            // console.log(detections.expressions)
            // this.setState({expressions:detections.expressions})
            try {
                this.props.updateExpressions(detections.expressions);            
            } catch (e) {
                console.log("얼굴 인식 중")
            }

      }

 

    componentWillMount() {
        if(this.props.streamManager){
            Promise.all([
                faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
                // faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
                // faceapi.nets.faceRecognitionNet.loadFromUri("/models"),
                faceapi.nets.faceExpressionNet.loadFromUri("/models"),
            ]).then(() => {
                // console.log(faceapi.nets);
                // setInterval(()=>{console.log("wait")}, 1000)
                // setInterval(this.faceapiInterval, 5000)
                let intervalId = setInterval(this.faceapiInterval, 5000)
                this.setState({ intervalId: intervalId })
            }).catch(() => {
                console.log("wait detection")
            });
        }
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

    componentWillUnmount(){
        clearInterval(this.state.intervalId)
    }

    render() {
        return <video autoPlay={true} ref={this.videoRef} className={styles.camera}/>;
    }

}
