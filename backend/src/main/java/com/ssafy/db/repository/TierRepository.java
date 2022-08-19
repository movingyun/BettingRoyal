package com.ssafy.db.repository;

import com.ssafy.db.entity.BadgeOwn;
import com.ssafy.db.entity.Tier;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface TierRepository extends JpaRepository<Tier, Integer> {

    /**
     * 티어 삭제
     */
    @Modifying
    @Transactional
    void deleteByTierId(int tierId);

    //티어 찾기
    @Query(value = "SELECT * FROM tier WHERE tier_id=?", nativeQuery = true)
    Tier findByTierId(int tierId);
}
