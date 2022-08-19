package com.ssafy.db.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

//한 게임에서 개인들이 받는 카드
//Entity로 사용하지 않음.
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PlayerCardSetInGame {
	List<Integer> cardSet;
}
