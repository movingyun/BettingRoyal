package com.ssafy.api.controller;

import com.ssafy.api.request.ReportRegistReq;
import com.ssafy.api.request.ReportResultReq;
import com.ssafy.api.service.ReportService;
import com.ssafy.api.service.UserService;
import com.ssafy.common.auth.SsafyUserDetails;
import com.ssafy.db.entity.Report;
import com.ssafy.db.entity.User;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import springfox.documentation.annotations.ApiIgnore;

import java.util.List;

@Api(value = "신고 API", tags = {"Report"})
@RestController
@RequestMapping("/api/report")
public class ReportController {

    @Autowired
    private ReportService reportService;

    @Autowired
    private UserService userService;

    @ApiOperation(value = "유저 신고", notes = "신고 성공 여부를 보여준다.")
    @PostMapping("")
    public ResponseEntity<String> userReport(@RequestBody ReportRegistReq reportRegistReq, @ApiIgnore Authentication authentication){
        //로그인 한 user정보 찾아오는 code
        //스켈레톤 코드 UserController에서 가져옴
        SsafyUserDetails userDetails = (SsafyUserDetails) authentication.getDetails();
        String userEmail = userDetails.getUsername();
        User user = userService.getUserByUserEmail(userEmail);

        Report report = Report.builder()
                .user(user)
                .reportReason(reportRegistReq.getReportReason())
                .reportBlackUserId(reportRegistReq.getReportBlackUserId())
                .build();
        reportService.createReport(report);
        return new ResponseEntity<>("SUCCESS", HttpStatus.OK);
    }

    @ApiOperation(value = "신고 결과", notes = "신고 결과 작성 성공 여부를 보여준다.")
    @PutMapping("")
    public ResponseEntity<String> reportResult(@RequestBody ReportResultReq reportResultReq){

        Report report = reportService.searchReport(reportResultReq.getReportId());
        report.setReportResult(reportResultReq.getReportResult());
        reportService.createReport(report);
        return new ResponseEntity<>("SUCCESS", HttpStatus.OK);
    }

    @ApiOperation(value = "해당 유저 신고 당한 목록", notes = "해당 유저의 신고 당했던 목록을 보여준다.")
    @GetMapping("/{reportBlackUserId}")
    public ResponseEntity<List<Report>> reportResult(@PathVariable int reportBlackUserId){


        return new ResponseEntity<>(reportService.searchReportUser(reportBlackUserId), HttpStatus.OK);
    }
}
