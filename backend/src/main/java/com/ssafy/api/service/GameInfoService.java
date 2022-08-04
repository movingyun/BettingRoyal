package com.ssafy.api.service;

import com.ssafy.db.entity.Game;
import com.ssafy.db.entity.GameInfo;
import com.ssafy.db.entity.User;
import com.ssafy.db.repository.GameInfoRepository;
import com.ssafy.db.repository.GameRepository;
import com.ssafy.db.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class GameInfoService {
	@Autowired
	private GameRepository gameRepository;
	@Autowired
	private UserRepository userRepository;
	@Autowired
	private GameInfoRepository gameInfoRepository;
	
	@Transactional
	public void createGameInfo(Game game, int userId, int card ) {
		//userId로 user생성
		//나중엔 토큰으로 가져와야된다.
		User player = userRepository.findById(userId).get();
		
		//gameInfo 정보(player, gameInfoId) 넣어주기
		GameInfo gameInfo = new GameInfo();
		gameInfo.setUser(player);
		gameInfo.setGameInfoId(0);
		gameInfo.setMycard(card);
		gameInfoRepository.save(gameInfo);
	}
}
