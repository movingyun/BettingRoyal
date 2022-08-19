package com.ssafy.db.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 클라이언트에게 보내주기 위한 정보들
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PlayerInfo {
    private String nickname;
    private String sessionId;
    private int myruby;
    private int mytotalBet;
    private int myCard;
    private String myPair;

}
