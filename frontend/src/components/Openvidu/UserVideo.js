import React, { Component } from "react";
import OpenViduVideoComponent from "./OvVideo";
import styles from "./UserVideo.module.css";
import card1 from "../../images/cards/1.png";
import card2 from "../../images/cards/2.png";
import card3 from "../../images/cards/3.png";
import card4 from "../../images/cards/4.png";
import card5 from "../../images/cards/5.png";
import card6 from "../../images/cards/6.png";
import card7 from "../../images/cards/7.png";
import card8 from "../../images/cards/8.png";
import card9 from "../../images/cards/9.png";
import card10 from "../../images/cards/10.png";
import card11 from "../../images/cards/11.png";
import card12 from "../../images/cards/12.png";
import card13 from "../../images/cards/13.png";
import card14 from "../../images/cards/14.png";
import card15 from "../../images/cards/15.png";
import card16 from "../../images/cards/16.png";
import card17 from "../../images/cards/17.png";
import card18 from "../../images/cards/18.png";
import card19 from "../../images/cards/19.png";
import card20 from "../../images/cards/20.png";
import card21 from "../../images/cards/21.png";
import card22 from "../../images/cards/22.png";
import card23 from "../../images/cards/23.png";
import card24 from "../../images/cards/24.png";
import card25 from "../../images/cards/25.png";
import card26 from "../../images/cards/26.png";
import card27 from "../../images/cards/27.png";
import card28 from "../../images/cards/28.png";
import card29 from "../../images/cards/29.png";
import card30 from "../../images/cards/30.png";
import card31 from "../../images/cards/31.png";
import card32 from "../../images/cards/32.png";
import card33 from "../../images/cards/33.png";
import card34 from "../../images/cards/34.png";
import card35 from "../../images/cards/35.png";
import card36 from "../../images/cards/36.png";
import card37 from "../../images/cards/37.png";
import card38 from "../../images/cards/38.png";
import card39 from "../../images/cards/39.png";
import card40 from "../../images/cards/40.png";
import ruby_get from "../../images/ruby/ruby_get.gif";
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

    this.classExpression = this.classExpression.bind(this);
  }

  getNicknameTag() {
    // Gets the nickName of the user
    return JSON.parse(this.props.streamManager.stream.connection.data).clientData;
  }

  // updateExpressions(event) {
  //     // this.setState({expressions:event});
  //     console.log(event)
  // }

  classExpression(expression, emotion) {
    if (emotion === "평온") {
      return styles.td4;
    }
    if (expression >= 75) {
      return styles.td1;
    } else if (expression >= 50) {
      return styles.td2;
    } else if (expression >= 25) {
      return styles.td3;
    } else {
      return styles.td4;
    }
  }

  // 감정 불러와 dictionary sort
  updateExpressions = (event) => {
    // console.log(event);
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
        // console.log(this.state.expressions);
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
        {this.props.win ? <img src={ruby_get} className={styles.rubyGet} /> : null}

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
            <div className={styles.ruby}>
              {this.props.player.myruby.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} 루비
            </div>
            {this.props.preaction.action ? (
              <div className={styles.speech_bubble}>
                {this.props.preaction.action}
                {this.props.player.mytotalBet}
              </div>
            ) : null}
          </div>
          <div className={styles.gameInfo}>
            {this.props.isStart && this.props.number != 0 ? (
              <div className={styles.card}>
                {/* 플레이어 카드 */}
                <div className={`${styles.card_back} ${styles.flip_back}`}>
                  <img src={card40} />
                </div>
                <div className={styles.card_front}>
                  <img src={"/images/cards/" + this.props.player.myCard + ".png"} />
                </div>
              </div>
            ) : null}
            {this.props.isStart && this.props.number == 0 ? (
              <div className={styles.card}>
                <div className={styles.mybackcard}>
                  {/* 플레이어 카드 */}
                  <img src={card40} />
                </div>
              </div>
            ) : null}

            <div className={styles.status}>{this.props.player.myPair}</div>
            <div className={styles.emotion}>
              <table>
                <tr>
                  <td
                    className={this.classExpression(
                      Math.floor(this.state.top1value * 100),
                      this.state.top1Emotion
                    )}
                  >
                    {this.state.top1Emotion}
                  </td>
                  <td>{Math.floor(this.state.top1value * 100)}%</td>
                </tr>
                <tr>
                  <td
                    className={this.classExpression(
                      Math.floor(this.state.top2value * 100),
                      this.state.top2Emotion
                    )}
                  >
                    {this.state.top2Emotion}
                  </td>
                  <td>{Math.floor(this.state.top2Value * 100)}%</td>
                </tr>
                <tr>
                  <td
                    className={this.classExpression(
                      Math.floor(this.state.top3value * 100),
                      this.state.top3Emotion
                    )}
                  >
                    {this.state.top3Emotion}
                  </td>
                  <td>{Math.floor(this.state.top3Value * 100)}%</td>
                </tr>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
