package com.ssafy.db.repository;

import com.ssafy.db.entity.Badge;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.transaction.annotation.Transactional;

public interface BadgeRepository extends JpaRepository<Badge, Integer> {

    @Modifying
    @Transactional
    void deleteByBadgeId(int badgeId);

    Badge findByBadgeId(int badgeId);
}
