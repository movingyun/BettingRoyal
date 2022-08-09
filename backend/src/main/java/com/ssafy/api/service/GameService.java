package com.ssafy.api.service;

import com.ssafy.db.entity.Game;
import com.ssafy.db.entity.Mission;
import com.ssafy.db.entity.User;
import com.ssafy.db.repository.GameRepository;
import com.ssafy.db.repository.MissionRepository;
import com.ssafy.db.repository.RoomRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Random;

@Service
public class GameService {

	@Autowired
	private GameRepository gameRepository;
	@Autowired
	private RoomRepository roomRepository;


	@Transactional
	public int createGame(int roomId, int card1, int card2, Mission mission) {// title content 받아옴
		Game game = new Game();
		game.setGameId(0);
		game.setGameGroundCart1(card1);
		game.setGameGroundCart2(card2);
		game.setRoom(roomRepository.findByRoomId(roomId));

		//게임에 미션도 넣어주기
		game.setMission(mission);
		game.setGameMission(mission.getMission());
		gameRepository.save(game);
		return gameRepository.findTopByOrderByGameIdDesc().getGameId();
	}

	@Transactional
	public Game modifyGame(Game game) {
		return gameRepository.save(game);
	};


}
