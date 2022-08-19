package com.ssafy.db.repository;

import com.ssafy.db.entity.BadgeOwn;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface BadgeOwnRepository extends JpaRepository<BadgeOwn, Integer> {

    /**
     * 유저가 사용중인 뱃지 가져옵니다.
     */
    @Query(value = "SELECT * FROM badge_own WHERE user_id=? AND badge_own_is_using IS true", nativeQuery = true)
    BadgeOwn findUsingBadge(int userId);

    @Query(value = "SELECT * FROM badge_own WHERE badge_id=? AND user_id=?", nativeQuery = true)
    BadgeOwn findByBadgeIdAndUserId(int badgeId, int userId);

    @Query(value = "SELECT * FROM badge_own WHERE user_id=?", nativeQuery = true)
    List<BadgeOwn> findByuserId(int userId);


}
