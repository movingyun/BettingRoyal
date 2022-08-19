package com.ssafy.db.entity;

import com.ssafy.db.vo.MessageType;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class GameMessage {
	private int roomId;
	private String senderNickName;
	private String socketId;
	private String message;
	private List<PlayerInfo> playerInfo;
	private int gameId;
	private int gameTotalBet;
	private int groundCardNum1;
	private int groundCardNum2;
	//초기값 null을 위해 Integer로 함
	private Integer turnIdx;
	private Integer preTurnIdx;
	private MessageType type;
	private int battingUnit;
	private String mission;
	private int gameMaxBet;
	private Integer winnerIdx;
}
