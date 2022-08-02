package com.ssafy.db.repository;

import com.ssafy.db.entity.Noticeboard;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface NoticeRepository extends JpaRepository<Noticeboard, Integer> {

//    // 공지 ID로 공지 조회
//    Optional<Noticeboard> findByNoticeboardId(Integer noticeId);
//    // 유저 ID로 공지 조회
////    List<Noticeboard> findByUserId(String userId);
//    // 공지 삭제
//    void deleteNoticeboardByNoticeboardIdAndUserId(Integer userId, Integer noticeId);

}
