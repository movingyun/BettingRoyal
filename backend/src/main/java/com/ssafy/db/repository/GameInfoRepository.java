package com.ssafy.db.repository;

import com.ssafy.db.entity.GameInfo;
import org.springframework.data.jpa.repository.JpaRepository;

public interface GameInfoRepository extends JpaRepository<GameInfo, Integer>{

}
