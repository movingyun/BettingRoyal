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
	public void createGameInfo(int gameId, User player, int card ) {
		//userId로 user생성
		//나중엔 토큰으로 가져와야된다.
		// 0807.새로 바꾼것은 유저 자체를 가져오도록 하기!

		//gameId로 Game정보 가져오기
		Game game = gameRepository.findByGameId(gameId);

		//gameInfo 정보(player, gameInfoId) 넣어주기
		GameInfo gameInfo = new GameInfo();
		gameInfo.setUser(player);
		gameInfo.setGame(game);
		gameInfo.setMycard(card);
		gameInfo.setRubyGet(0);
		gameInfoRepository.save(gameInfo);
	}

	@Transactional
	public void unitBetting(int gameId, int userId, int unitBettingCnt ) {
		//지금 얘 gameInfo가져오기
		GameInfo gameInfo = gameInfoRepository.findByGameIdAndUserId(gameId, userId);
		//현재까지 베팅 금액
		int currentBetting = gameInfo.getRubyGet();
		//콜하려면 베팅해야하는 금액 빼준다.
		gameInfo.setRubyGet(currentBetting-unitBettingCnt);
		gameInfoRepository.save(gameInfo);
	}

	@Transactional
	public void callBetting(int gameId, int userId, int callBettingCnt ) {
		//지금 얘 gameInfo가져오기
		GameInfo gameInfo = gameInfoRepository.findByGameIdAndUserId(gameId, userId);
		//현재까지 베팅 금액(ex.5베팅했으면 -5로 나온다)
		int currentBetting = gameInfo.getRubyGet();
		//콜하려면 베팅해야하는 금액 빼준다.
		gameInfo.setRubyGet(currentBetting-callBettingCnt);
		gameInfoRepository.save(gameInfo);
	}

	@Transactional
	public void raiseBetting(int gameId, int userId, int raiseBettingCnt ) {
		//지금 얘 gameInfo가져오기
		GameInfo gameInfo = gameInfoRepository.findByGameIdAndUserId(gameId, userId);
		//현재까지 베팅 금액(ex.5베팅했으면 -5로 나온다)
		int currentBetting = gameInfo.getRubyGet();
		//콜하려면 베팅해야하는 금액 빼준다.
		gameInfo.setRubyGet(currentBetting-raiseBettingCnt);
		gameInfoRepository.save(gameInfo);
	}


	@Transactional
	public void allInBetting(int gameId, int userId, int BettingCnt ) {
		//지금 얘 gameInfo가져오기
		GameInfo gameInfo = gameInfoRepository.findByGameIdAndUserId(gameId, userId);
		//현재까지 베팅 금액(ex.5베팅했으면 -5로 나온다)
		int currentBetting = gameInfo.getRubyGet();
		//콜하려면 베팅해야하는 금액 빼준다.
		gameInfo.setRubyGet(currentBetting-BettingCnt);
		gameInfoRepository.save(gameInfo);
	}

	@Transactional
	public void winnerGetRubyAndWriteWin(int gameId, int userId, int winnerRuby ) {
		//지금 얘 gameInfo가져오기
		GameInfo gameInfo = gameInfoRepository.findByGameIdAndUserId(gameId, userId);
		//현재까지 베팅 금액(ex.5베팅했으면 -5로 나온다)
		int currentBetting = gameInfo.getRubyGet();
		//이겨서 딴 루비를 더해준다.
		gameInfo.setRubyGet(currentBetting+winnerRuby);
		//이긴거 기록해주기
		gameInfo.setIsWinner(true);
		gameInfoRepository.save(gameInfo);
	}

}
