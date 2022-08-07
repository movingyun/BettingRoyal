package com.ssafy.db.repository;

import com.ssafy.db.entity.Game;
import org.springframework.data.jpa.repository.JpaRepository;

public interface GameRepository extends JpaRepository<Game, Integer>{
	Game findByGameId(int gameId);
	//제일 위의 있는 게임을 가져온다.
	Game findTopByOrderByGameIdDesc();
}
