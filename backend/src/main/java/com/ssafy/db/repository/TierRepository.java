package com.ssafy.db.repository;

import com.ssafy.db.entity.Tier;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.transaction.annotation.Transactional;

public interface TierRepository extends JpaRepository<Tier, Integer> {

    /**
     * 티어 삭제
     */
    @Modifying
    @Transactional
    void deleteByTierId(int tierId);
}
