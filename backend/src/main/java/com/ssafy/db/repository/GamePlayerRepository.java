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
    
    
    
    
}
