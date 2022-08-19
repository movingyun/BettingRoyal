package com.ssafy.db.repository;

import com.ssafy.db.entity.PlayerCardSetInGame;
import org.springframework.stereotype.Repository;

import javax.annotation.PostConstruct;
import java.util.LinkedHashMap;
import java.util.Map;

@Repository
//게임 당 개인카드 분배를 관리하는 Repository
//DB랑 관계없이 서버에서만 유지 예정
//Map<Integer GameId, MyCardsInGame myCardsInGame>
public class PlayerCardSetInGameRepository {
	private Map<Integer, PlayerCardSetInGame> playerCardSetInGameMap;
	
    @PostConstruct
    private void init(){
    	playerCardSetInGameMap = new LinkedHashMap<>();
    }
	
    //게임의 개인카드 뭉치를 받아서 Map을 만들어준다.
    public void addPlayerCardSet(Integer gameId, PlayerCardSetInGame playerCardSetInGame){
    	playerCardSetInGameMap.put(gameId, playerCardSetInGame);
    }
	
    //현재 총 몇개의 게임이 있는지 알려준다.
    public int getGameCnt() {
    	return playerCardSetInGameMap.size();
    }
    
    //해당 게임의 개인 카드셋을 돌려준다.
    public PlayerCardSetInGame getCardSet(int gameId) {
    	return playerCardSetInGameMap.get(gameId);
    }
	
}
