package com.ssafy.db.repository;

import com.ssafy.db.entity.GamePlayer;
import org.springframework.stereotype.Repository;

import javax.annotation.PostConstruct;
import java.util.ArrayList;
import java.util.List;

@Repository
public class GamePlayerRepository {
	private List<GamePlayer> gamePlayerMap;
	
    @PostConstruct
    private void init(){
    	gamePlayerMap = new ArrayList<GamePlayer>();
    }
    
    public void addGamePlayer(int roomId, String sessionId) {
    	GamePlayer gamePlayer = new GamePlayer();
    	gamePlayer.setRoomId(roomId);
    	gamePlayer.setSessionId(sessionId);
    	if(getGamePlayer(roomId).size()==0) {
    		gamePlayer.setMyTurn(true);
    	}else {
    		gamePlayer.setMyTurn(false);
    	}
    	gamePlayerMap.add(gamePlayer);
    }
    
    public boolean deleteGamePlayer(int roomId, String sessionId) {
    	List<GamePlayer> gp = getGamePlayer(roomId);
    	
    	boolean flag = false;
    	
    	for(int i=0; i<gp.size(); i++) {
    		//나간애면
    		if(gp.get(i).getSessionId()==sessionId) {
    			//그사람 턴인지 확인?
    			if(gp.get(i).isMyTurn()) {
    				flag=true;
    			}
    			gamePlayerMap.remove(gp.get(i));
    		}
    	}
    	
    	return flag;
    }
    
    public List<GamePlayer> getGamePlayer(int roomId){
    	List<GamePlayer> gp = new ArrayList<GamePlayer>();
    	for(GamePlayer gamePlayer : gamePlayerMap) {
    		if(gamePlayer.getRoomId()==roomId) {
    			gp.add(gamePlayer);
    		}
    	}
    	return gp;
    }

	//CALL 베팅하기 - call하려면 몇개 베팅해야되는지 돌려주자
	public int callBetting(int roomId, String sessionId){
		List<GamePlayer> gamePlayerList = getGamePlayer(roomId);
		int callBettingCnt = 0;
		for(int i=0; i<gamePlayerList.size(); i++) {
			//베팅한 애면
			if(gamePlayerList.get(i).getSessionId()==sessionId) {
				//현재까지 베팅 금액
				int currentBetting = gamePlayerList.get(i).getMyBetting();
				//콜하려면 내야하는 금액
				callBettingCnt = gamePlayerList.get(i).getMaxBetting() - currentBetting;
				//베팅 Cnt만큼 바꿔주기
				gamePlayerList.get(i).setMyBetting(currentBetting+callBettingCnt);
			}
		}
		return callBettingCnt;
	}
}
