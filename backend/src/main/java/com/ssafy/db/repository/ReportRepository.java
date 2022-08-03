package com.ssafy.db.repository;

import com.ssafy.db.entity.Report;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReportRepository extends JpaRepository<Report, Integer> {

    /**
     *한 유저의 신고 당한 목록 보기위해
     */
    List<Report> findByReportBlackUserId(int reportBlackUserId);

    /**
     * 신고 아이디로 신고 찾기
     */
    Report findByReportId(int reportId);
}
