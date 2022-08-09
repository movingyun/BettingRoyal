package com.ssafy.db.repository;

import com.ssafy.db.entity.Mission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface MissionRepository extends JpaRepository<Mission, Integer> {

    @Query(value = "SELECT count(*) FROM mission",nativeQuery = true)
    int getMissionCnt();

    Mission findByMissionId(int missionId);
}
