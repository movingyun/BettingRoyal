package com.ssafy.db.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

//게임에 참여한 사람들 기록
//Entity로 사용하지 않음.
@Data
@NoArgsConstructor
@AllArgsConstructor
public class GamePlayer {
	private int roomId;
	private int gameId;
	private int myRuby;
	private String nickName;
	private String sessionId;
	private boolean myTurn;
	//게임의 최대 배팅금액
	private int maxBetting;
	//내 배팅금액
	private int myBetting;
	//다이 확인
	private  boolean isDie;
	//내카드
	private int myCard;
	//방 기본 배팅
	private int battingUnit;

	private User user;
}
