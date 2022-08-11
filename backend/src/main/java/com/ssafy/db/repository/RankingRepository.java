package com.ssafy.db.repository;

import com.ssafy.db.entity.Ranking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface RankingRepository extends JpaRepository<Ranking, Integer> {

    @Query(value = "SELECT * FROM (SELECT * FROM ranking ORDER BY ranking_id DESC LIMIT 20) t ORDER BY t.ranking_id", nativeQuery = true)
    List<Ranking> findByLast20();
}
