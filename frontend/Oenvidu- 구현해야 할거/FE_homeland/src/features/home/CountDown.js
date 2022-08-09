import React from "react";
import { CountdownCircleTimer } from "react-countdown-circle-timer";
import "./CountDown.css";

const renderTime = (dimension, time) => {
  return (
    <div className="time-wrapper">
      <div className="time">{time}</div>
      <div>{dimension}</div>
    </div>
  );
};

const getTimeSeconds = (time) => (6 - time) | 0;

function CountDown() {
  return (
    <div className="CountDown">
      <div className="timer-wrapper">
        <CountdownCircleTimer
          isPlaying
          duration={6}
          colors={["#54afb8", "#268ddd", "#7bc75e", "#7bc75e", "#54ac99"]}
          colorsTime={[5, 4, 3, 2, 0]}
          initialRemainingTime={6}
        >
        {({ elapsedTime, color }) => (
          <span style={{ color }}>
            {renderTime("초", getTimeSeconds(elapsedTime))}
          </span>
        )}
        </CountdownCircleTimer>
      </div>
    </div>
  );
}

export default CountDown;