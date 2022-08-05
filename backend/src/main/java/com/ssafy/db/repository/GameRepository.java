package com.ssafy.db.repository;

import com.ssafy.db.entity.Game;
import org.springframework.data.jpa.repository.JpaRepository;

public interface GameRepository extends JpaRepository<Game, Integer>{
	Game findByGameId(int gameId);
	Game findTopByOrderByGameIdDesc();
}
