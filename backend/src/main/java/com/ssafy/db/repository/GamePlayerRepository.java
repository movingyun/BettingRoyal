package com.ssafy.db.repository;

import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.ssafy.api.service.UserService;
import com.ssafy.common.util.JwtTokenUtil;
import com.ssafy.db.entity.GameMessage;
import com.ssafy.db.entity.GamePlayer;

import com.ssafy.db.entity.User;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import javax.annotation.PostConstruct;
import java.util.ArrayList;
import java.util.List;

@Repository
@Log4j2
public class GamePlayerRepository {

	private List<GamePlayer> gamePlayerMap;

	@Autowired
	private UserService userService;
	@Autowired
	private UserRepository userRepository;
	@Autowired
	private RoomSizeRepository roomSizeRepository;

    @PostConstruct
    private void init(){
    	gamePlayerMap = new ArrayList<GamePlayer>();
    }
    
    public void addGamePlayer(GameMessage message, String sessionId) {
    	GamePlayer gamePlayer = new GamePlayer();
    	gamePlayer.setRoomId(message.getRoomId());
    	gamePlayer.setSessionId(sessionId);
    	if(getGamePlayer(message.getRoomId()).size()==0) {
    		gamePlayer.setMyTurn(true);
    	}else {
    		gamePlayer.setMyTurn(false);
    	}
		// TODO: 진짜 돌릴땐 이거 켜줘서 access-token으로 정보 가져오게
		String token = message.getSenderNickName();
		JWTVerifier verifier = JwtTokenUtil.getVerifier();
		JwtTokenUtil.handleError(token);
		DecodedJWT decodedJWT = verifier.verify(token.replace(JwtTokenUtil.TOKEN_PREFIX, ""));
		String userEmail = decodedJWT.getSubject();
		gamePlayer.setUser(userService.getUserByUserEmail(userEmail));
//		gamePlayer.setUser(userRepository.findByUserId(roomSizeRepository.getRoomSize(message.getRoomId())));
		gamePlayerMap.add(gamePlayer);
	}


	public int findRoomBySesssionId(String sessionId) {
		int roomid=-1;
		for (int i=0; i<gamePlayerMap.size(); i++){
			System.out.println(gamePlayerMap.get(i).getSessionId());
			System.out.println(sessionId);
			if(gamePlayerMap.get(i).getSessionId()==sessionId){
				roomid= gamePlayerMap.get(i).getRoomId();
			}
		}
		return roomid;
	}
    
    public boolean deleteGamePlayer(int roomId, String sessionId) {
    	List<GamePlayer> gp = getGamePlayer(roomId);
    	
    	boolean flag = false;
    	
    	for(int i=0; i<gp.size(); i++) {
    		//나간애면
    		if(gp.get(i).getSessionId().equals(sessionId)) {
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
			if(gamePlayerList.get(i).getSessionId().equals(sessionId)) {
				//현재까지 베팅 금액
				int currentBetting = gamePlayerList.get(i).getMyBetting();
				log.info("현재까지 베팅 금액 : " + currentBetting);
				//콜 하려면 내야하는 금액이 내 남은 돈보다 많으면
				callBettingCnt = gamePlayerList.get(i).getMaxBetting()-currentBetting;
				if(callBettingCnt >= gamePlayerList.get(i).getUser().getUserRuby()){
					callBettingCnt = gamePlayerList.get(i).getUser().getUserRuby();
				}else {
					//콜하려면 내야하는 금액
					callBettingCnt = gamePlayerList.get(i).getMaxBetting() - currentBetting;
				}
				log.info("콜 하려면 내야하는 금액 : "+ callBettingCnt);
			}
		}
		return callBettingCnt;
	}

	//RAISE 베팅하기
	public int raiseBetting(int roomId, String sessionId,int raiseCnt){
		//현재 방에있는 플레이어 수
		List<GamePlayer> gamePlayerList = getGamePlayer(roomId);
		int callBettingCnt = 0;
		for(int i=0; i<gamePlayerList.size(); i++) {
			//베팅한 애면
			if(gamePlayerList.get(i).getSessionId().equals(sessionId)) {
				//현재까지 베팅 금액
				int currentBetting = gamePlayerList.get(i).getMyBetting();
				log.info("현재까지 낸 돈 : "+currentBetting);
				//콜하려면 내야하는 금액
				callBettingCnt = gamePlayerList.get(i).getMaxBetting() - currentBetting;
				log.info("콜 하려면 내야하는 금액 : "+callBettingCnt);
				//(콜+레이즈)Cnt만큼 바꿔주기
				gamePlayerList.get(i).setMyBetting(currentBetting+(callBettingCnt+raiseCnt));
				log.info("레이즈 하면서 더 내야되는 금액 : "+ (callBettingCnt+raiseCnt));
			}
		}
		return callBettingCnt+raiseCnt;
	}

	//DIE 베팅하기
	public void dieBetting(int roomId, String sessionId){
		//현재 방에있는 플레이어 수
		List<GamePlayer> gamePlayerList = getGamePlayer(roomId);
		for(int i=0; i<gamePlayerList.size(); i++) {
			//베팅한 애면
			if(gamePlayerList.get(i).getSessionId().equals(sessionId)) {
				gamePlayerList.get(i).setDie(true);
			}
		}
	}

	//ALLIN 베팅하기
	public int allInBetting(int roomId, String sessionId){
		//현재 방에있는 플레이어 수
		List<GamePlayer> gamePlayerList = getGamePlayer(roomId);
		int callBettingCnt = 0;
		int allInBettingCnt = 0;
		for(int i=0; i<gamePlayerList.size(); i++) {
			//베팅한 애면
			if(gamePlayerList.get(i).getSessionId().equals(sessionId)) {
				//현재까지 베팅 금액
				int currentBetting = gamePlayerList.get(i).getMyBetting();
				log.info("현재까지 낸 금액 : " + currentBetting);
				//콜하려면 내야하는 금액
				callBettingCnt = gamePlayerList.get(i).getMaxBetting() - currentBetting;
				log.info("콜 하려면 내야하는 금액 : " + callBettingCnt);
				//올인하면 추가로 내는 금액
				allInBettingCnt = gamePlayerList.get(i).getUser().getUserRuby()-callBettingCnt;
				log.info("올인하면 추가로 내는 금액 : "+ allInBettingCnt);
			}
		}
		return allInBettingCnt;
	}
}
