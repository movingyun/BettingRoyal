package com.ssafy.api.controller;

import com.ssafy.api.request.NoticeDeleteReq;
import com.ssafy.api.request.NoticePostReq;
import com.ssafy.api.request.NoticeUpdateReq;
import com.ssafy.api.response.NoticeFindIdRes;
import com.ssafy.api.response.NoticeListRes;
import com.ssafy.api.service.NoticeService;
import com.ssafy.api.service.UserService;
import com.ssafy.common.auth.SsafyUserDetails;
import com.ssafy.common.model.response.BaseResponseBody;
import com.ssafy.db.entity.Noticeboard;
import com.ssafy.db.entity.User;
import io.swagger.annotations.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import springfox.documentation.annotations.ApiIgnore;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.List;

@Api(value = "유저 API", tags = {"Notice"})
@RestController
@RequestMapping("/api/notice")
public class NoticeController {
    @Autowired
    NoticeService noticeService;
    @Autowired
    UserService userService;

    @PostMapping("")
    @ApiOperation(value = "공지사항 작성", notes = "공지사항을 작성한다")
    @ApiResponses({
            @ApiResponse(code = 200, message = "성공"),
            @ApiResponse(code = 401, message = "인증 실패"),
            @ApiResponse(code = 404, message = "사용자 없음"),
            @ApiResponse(code = 500, message = "서버 오류")
    })
    public ResponseEntity<? extends BaseResponseBody> create(
            @ApiParam(value="공지사항 작성", readOnly = true) @RequestBody NoticePostReq noticePostReq,
            @ApiIgnore Authentication authentication
    ) throws Exception {
        SsafyUserDetails userDetails = (SsafyUserDetails) authentication.getDetails();
        String userId = userDetails.getUsername();
        User user = userService.getUserByUserEmail(userId);

        noticeService.createNotice(noticePostReq, user);
        return ResponseEntity.status(200).body(BaseResponseBody.of(200, "Success"));
    }

    @GetMapping("/{noticeId}")
    @ApiOperation(value = "공지사항 조회", notes = "공지사항을 조회한다.")
    @ApiResponses({
            @ApiResponse(code = 200, message = "성공"),
            @ApiResponse(code = 401, message = "인증 실패"),
            @ApiResponse(code = 404, message = "사용자 없음"),
            @ApiResponse(code = 500, message = "서버 오류")
    })
    public ResponseEntity<NoticeFindIdRes> findNoticeId (
            @ApiParam(value="공지사항 조회")  @PathVariable Integer noticeId ,@ApiIgnore Authentication authentication) {
        Noticeboard noticeboard = noticeService.findByNoticeId(noticeId);
        NoticeFindIdRes res = new NoticeFindIdRes();
        res.setNoticeId(noticeboard.getNoticeboardId());
        res.setNoticeTitle(noticeboard.getNoticeboardTitle());
        res.setNoticeContent(noticeboard.getNoticeboardContent());
        res.setNoticeHit(noticeboard.getNoticeboardHit());
        res.setUserNickname(noticeboard.getUser().getUserNickname());
        res.setNoticeDate(noticeboard.getNoticeboardDate());
        return new ResponseEntity<>(res, HttpStatus.OK);
    }

    @GetMapping("")
    @ApiOperation(value = "공지사항 목록 조회", notes = "공지사항을 조회한다.")
    @ApiResponses({
            @ApiResponse(code = 200, message = "성공"),
            @ApiResponse(code = 401, message = "인증 실패"),
            @ApiResponse(code = 404, message = "사용자 없음"),
            @ApiResponse(code = 500, message = "서버 오류")
    })
    public ResponseEntity<List<NoticeListRes>>  getNoticeList (
            @ApiIgnore Authentication authentication) {

        List<Noticeboard> lists = noticeService.noticeList();
        List<NoticeListRes> noticeListRes = new ArrayList<>();
        Collections.reverse(lists);
        SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy년 MM월 dd일");

        for(Noticeboard list : lists) {
//            noticeList.add(new NoticeListRes(entity));
            NoticeListRes res = new NoticeListRes();
            res.setId(list.getNoticeboardId());
            res.setNoticeTitle(list.getNoticeboardTitle());
            res.setUserNickname(list.getUser().getUserNickname());
            res.setNoticeDate(simpleDateFormat.format(list.getNoticeboardDate()));
            res.setNoticeHit(list.getNoticeboardHit());
            noticeListRes.add(res);
        }
        return new ResponseEntity<>(noticeListRes, HttpStatus.OK);
    }

    @PutMapping("")
    @ApiOperation(value = "공지사항 수정", notes = "공지사항을 수정한다.")
    @ApiResponses({
            @ApiResponse(code = 200, message = "성공"),
            @ApiResponse(code = 401, message = "인증 실패"),
            @ApiResponse(code = 404, message = "사용자 없음"),
            @ApiResponse(code = 500, message = "서버 오류")
    })
    public ResponseEntity<? extends BaseResponseBody> modify (
            @ApiParam(value = "공지사항 수정", required = true)  @RequestBody NoticeUpdateReq noticeUpdateReq,
            @ApiIgnore Authentication authentication
        ) throws Exception {
        SsafyUserDetails userDetails = (SsafyUserDetails) authentication.getDetails();
        String userId = userDetails.getUsername();
        User user = userService.getUserByUserEmail(userId);

        Noticeboard notice = noticeService.updateNotice(noticeUpdateReq, user );
        return ResponseEntity.status(200).body(BaseResponseBody.of(200, "Success"));
    }

    @DeleteMapping("")
    @ApiOperation(value = "공지사항 삭제", notes = "공지사항을 삭제한다")
    @ApiResponses({
            @ApiResponse(code = 200, message = "성공"),
            @ApiResponse(code = 401, message = "인증 실패"),
            @ApiResponse(code = 404, message = "사용자 없음"),
            @ApiResponse(code = 500, message = "서버 오류")
    })
    public ResponseEntity<?> delete (@RequestBody NoticeDeleteReq noticeDeleteReq, @ApiIgnore Authentication authentication) {
        SsafyUserDetails userDetails = (SsafyUserDetails) authentication.getDetails();
        String userId = userDetails.getUsername();
        User user = userService.getUserByUserEmail(userId);

        Integer noticeId = noticeDeleteReq.getNoticeId();
        noticeService.deleteNotice(noticeId);
        return ResponseEntity.status(200).body(BaseResponseBody.of(200, "Success"));
    }

}
