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
	private Integer gameId;
	private String sessionId;
	private boolean myTurn;
	//게임의 최대 배팅금액
	private int maxBetting;
	//내 배팅금액
	private int myBetting;
	//다이 확인
	private  boolean isDie;
	//내카드
	private Integer myCard;
	//방 기본 배팅
	private int battingUnit;
	//내 족보
	//0:트리플 / 1:스트레이트 / 2:더블 / 3:탑
	private Integer myPair;

	private User user;
	private Integer groundCard1;
	private Integer groundCard2;
	//게임 총 배팅금액
	private Integer gameTotalBet;
}
