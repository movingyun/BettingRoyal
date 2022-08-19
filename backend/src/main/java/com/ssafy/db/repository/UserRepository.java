package com.ssafy.db.repository;

import com.ssafy.db.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

/**
 * 유저 모델 관련 디비 쿼리 생성을 위한 JPA Query Method 인터페이스 정의.
 */

@Repository
public interface UserRepository extends JpaRepository<User, Integer> {
    // 아래와 같이, Query Method 인터페이스(반환값, 메소드명, 인자) 정의를 하면 자동으로 Query Method 구현됨.
    Optional<User> findByUserEmail(String userEmail);
    User findByUserNickname(String userNickname);
    @Query(value = "SELECT * from user where user_type=0 and user_is_active = 1", nativeQuery = true)
    List<User> findActiveUser();

    List<User> findByUserIdIn(List<Integer> userIdList);

    User findByUserId(Integer userId);

    @Modifying
    @Transactional
    void deleteByUserId(Integer userId);

    @Query(value = "select t.user_id, t.user_create, t.user_email, t.user_game_count, t.user_gender, t.user_guild, t.user_is_active, t.user_nickname, t.user_pw, t.user_recent, t.user_row, t.user_ruby, t.user_type, t.user_vault, t.user_win, t.tier_id\n" +
            "FROM (SELECT *, user_ruby + user_vault total_ruby from user ORDER BY total_ruby DESC LIMIT 20) t", nativeQuery = true)
    List<User> findTop20User();

    List<User> findByUserNicknameContaining(String userNickname);
}
