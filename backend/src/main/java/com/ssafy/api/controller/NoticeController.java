package com.ssafy.api.controller;

import com.ssafy.api.request.NoticeDeleteReq;
import com.ssafy.api.request.NoticePostReq;
import com.ssafy.api.request.NoticeUpdateReq;
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
            @ApiParam(value="공지사항 작성", readOnly = true) @ModelAttribute NoticePostReq noticePostReq,
            @ApiIgnore Authentication authentication
    ) throws Exception {
        SsafyUserDetails userDetails = (SsafyUserDetails) authentication.getDetails();
        String userId = userDetails.getUsername();
        User user = userService.getUserByUserEmail(userId);

        noticeService.createNotice(noticePostReq, user);
        return ResponseEntity.status(200).body(BaseResponseBody.of(200, "Success"));
    }

    @GetMapping("")
    @ApiOperation(value = "공지사항 조회", notes = "공지사항을 조회한다.")
    @ApiResponses({
            @ApiResponse(code = 200, message = "성공"),
            @ApiResponse(code = 401, message = "인증 실패"),
            @ApiResponse(code = 404, message = "사용자 없음"),
            @ApiResponse(code = 500, message = "서버 오류")
    })
    public ResponseEntity<Noticeboard> findNoticeId (
            @ApiParam(value="공지사항 조회") Integer noticeId ,@ApiIgnore Authentication authentication) {
        Noticeboard noticeboard = noticeService.findByNoticeId(noticeId);
        return new ResponseEntity<>(noticeboard, HttpStatus.OK);
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
            @ApiParam(value = "공지사항 수정", required = true)  @ModelAttribute NoticeUpdateReq noticeUpdateReq,
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
