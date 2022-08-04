package com.ssafy.api.service;

import com.ssafy.db.entity.Report;
import com.ssafy.db.repository.ReportRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ReportService {

    @Autowired
    private ReportRepository reportRepository;

    @Transactional
    public void createReport(Report report){
        reportRepository.save(report);
    }

    @Transactional
    public void modifyReport(Report report){
        reportRepository.save(report);
    }

    @Transactional
    public List<Report> searchReportUser(int reportBlackUserId){
        return reportRepository.findByReportBlackUserId(reportBlackUserId);
    }

    @Transactional
    public Report searchReport(int reportId){
        return reportRepository.findByReportId(reportId);
    }



}
