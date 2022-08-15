import React, { Component } from "react";
import OpenViduVideoComponent from "./OvVideo";
import styles from "./UserVideo.module.css";
import card_back from "../../images/cards/card_back.png";
import card_am_1 from "../../images/cards/card_am_1.png";

export default class UserVideoComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      expressions: [],
      top1Emotion: "Top1",
      top1value: 0,
      top2Emotion: "Top2",
      top2Value: 0,
      top3Emotion: "Top3",
      top3Value: 0,
    };
  }

  getNicknameTag() {
    // Gets the nickName of the user
    return JSON.parse(this.props.streamManager.stream.connection.data).clientData;
  }

  // updateExpressions(event) {
  //     // this.setState({expressions:event});
  //     console.log(event)
  // }

  // 감정 불러와 dictionary sort
  updateExpressions = (event) => {
    console.log(event);
    const Emotions = {
      angry: "화남",
      disgusted: "역함",
      fearful: "공포",
      happy: "기쁨",
      neutral: "평온",
      sad: "슬픔",
      surprised: "놀람",
    };
    var items = Object.keys(event).map((key) => {
      return [Emotions[key], event[key]];
    });

    items.sort((first, second) => {
      return first[1] - second[1];
    });
    // var keys = items.map((e) => {return e[0]});
    // console.log(keys)
    // console.log(items)

    this.setState(
      {
        expressions: items,
        top1Emotion: items[6][0],
        top1value: items[6][1],
        top2Emotion: items[5][0],
        top2Value: items[5][1],
        top3Emotion: items[4][0],
        top3Value: items[4][1],
      },
      () => {
        console.log(this.state.expressions);
        // console.log(this.state.expressions[6][0])
        // console.log(this.state.expressions[6][1])
      }
    );
  };
  // catch(error) {
  //     console.log(error)
  // }

  render() {
    return (
      <div className={styles.container}>
        <div className={styles.cam}>
          {this.props.streamManager !== undefined ? (
            <div className={styles.openvidu}>
              <OpenViduVideoComponent
                streamManager={this.props.streamManager}
                updateExpressions={this.updateExpressions}
              />
            </div>
          ) : null}
        </div>
        <div className={styles.info}>
          <div className={styles.userInfo}>
            <div className={styles.name}>{this.props.player.nickname}</div>
            <div className={styles.ruby}>{this.props.player.myruby} 루비</div>
          </div>
          <div className={styles.gameInfo}>
            <div className={styles.card}>
              {/* 플레이어 카드 */}
              <div className={styles.card_front}>
                <img src={card_am_1} />
              </div>
            </div>
            <div className={styles.status}>{this.props.player.myPair}</div>
            <div className={styles.emotion}>
              <table>
                <tr>
                  <td className={styles.td}>{this.state.top1Emotion}</td>
                  <td>{Math.floor(this.state.top1value * 100)}%</td>
                </tr>
                <tr>
                  <td className={styles.td}>{this.state.top2Emotion}</td>
                  <td>{Math.floor(this.state.top2Value * 100)}%</td>
                </tr>
                <tr>
                  <td className={styles.td}>{this.state.top3Emotion}</td>
                  <td>{Math.floor(this.state.top2Value * 100)}%</td>
                </tr>
              </table>
            </div>
          </div>
        </div>
      </div>

    );
  }
}
