package com.ssafy.db.entity;

import com.ssafy.db.vo.MessageType;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class GameMessage {
	private int roomId;
	private String writer;
	private String message;
	private MessageType type;
}
