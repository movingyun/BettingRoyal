import React, { Component } from 'react';
import OpenViduVideoComponent from './OvVideo';
import styles from './UserVideo.module.css';
import card_back from "../../images/cards/card_back.png";
import card_am_1 from "../../images/cards/card_am_1.png";

export default class UserVideoComponent extends Component {

    getNicknameTag() {
        // Gets the nickName of the user
        return JSON.parse(this.props.streamManager.stream.connection.data).clientData;
    }

    render() {
        return (
            <div className={styles.container}>
                <div className={styles.cam}>
                    {this.props.streamManager !== undefined ? (
                        <div className={styles.openvidu}>
                            <OpenViduVideoComponent streamManager={this.props.streamManager} />
                        </div>
                    ) : null}
                </div>
                    <div className={styles.info}>
                        <div className={styles.userInfo}>
                            <div className={styles.name}>{this.getNicknameTag()}</div>
                            <div className={styles.ruby}>100,000 루비</div>
                        </div>
                        <div className={styles.gameInfo}>
                            <div className={styles.card}>
                                <div className={styles.card_back}>
                                    <img src={card_back} />
                                </div>
                                <div className={styles.card_front}>
                                    <img src={card_am_1} />
                                </div>
                            </div>
                            <div className={styles.status}>더블</div>
                            <div className={styles.emotion}>
                                <table>
                                    <tr>
                                        <td className={styles.td}>긴장</td>
                                        <td>64%</td>
                                    </tr>
                                    <tr>
                                        <td className={styles.td}>분노</td>  
                                        <td>37%</td>   
                                    </tr>
                                    <tr>
                                        <td className={styles.td}>행복</td>  
                                        <td>12%</td>    
                                    </tr>
                                </table>
                            </div>
                        </div>
                    </div>
        
          </div>

            // <div>
            //     {this.props.streamManager !== undefined ? (
            //         <div className="streamcomponent">
            //             <OpenViduVideoComponent streamManager={this.props.streamManager} />
            //             {/* <div><p>{this.getNicknameTag()}</p></div> */}
            //         </div>
            //     ) : null}
            // </div>
        );
    }
}
