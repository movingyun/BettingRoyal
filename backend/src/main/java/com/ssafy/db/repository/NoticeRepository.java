package com.ssafy.db.repository;

import com.ssafy.db.entity.Noticeboard;
import com.ssafy.db.entity.User;
import org.kurento.client.internal.server.Param;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

public interface NoticeRepository extends JpaRepository<Noticeboard, Integer> {

    // 공지 ID로 공지 조회
    Optional<Noticeboard> findByNoticeboardId(Integer noticeId);
    // 유저 ID로 공지 조회
    @Query(value = "select * from user where user_id=?",nativeQuery = true)
    List<Noticeboard> findByUserId(@Param("userId") Integer userId);
    // 공지 삭제
    @Modifying
    @Transactional
    @Query(value = "delete from noticeboard where noticeboard_id=?",nativeQuery = true)
    void deleteNoticeboardByNoticeboardIdAndUserId( Integer noticeId);

}
