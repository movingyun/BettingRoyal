package com.ssafy.db.repository;

import com.ssafy.db.entity.GameInfo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface GameInfoRepository extends JpaRepository<GameInfo, Integer>{
    @Query(value = "SELECT * FROM game_info WHERE gmae_id=? AND user_nickname=?", nativeQuery = true)
    GameInfo findByGameIdAndUserNickname(Integer gameId, String userNickname);
}
