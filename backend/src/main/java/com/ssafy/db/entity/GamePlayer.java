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
	private String sessionId;
	private boolean myTurn;
	//게임의 최대 배팅금액
	private int maxBetting;
	//내 배팅금액
	private int myBetting;
}
