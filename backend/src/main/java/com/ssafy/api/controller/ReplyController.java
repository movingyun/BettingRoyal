package com.ssafy.api.controller;

import com.ssafy.api.request.*;
import com.ssafy.api.service.BoardService;
import com.ssafy.api.service.ReplyService;
import com.ssafy.api.service.UserService;
import com.ssafy.common.auth.SsafyUserDetails;
import com.ssafy.common.model.response.BaseResponseBody;
import com.ssafy.db.entity.Badge;
import com.ssafy.db.entity.Board;
import com.ssafy.db.entity.Reply;
import com.ssafy.db.entity.User;
import io.swagger.annotations.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import springfox.documentation.annotations.ApiIgnore;

import java.util.List;

@Api(value = "유저 API", tags = {"Reply"})
@RestController
@RequestMapping("/api/board/{boardId}/reply")
public class ReplyController {

    @Autowired
    ReplyService replyService;
    @Autowired
    UserService userService;
    @Autowired
    BoardService boardService;

    @PostMapping("")
    @ApiOperation(value = "댓글 작성", notes = "댓글을 작성한다")
    @ApiResponses({
            @ApiResponse(code = 200, message = "성공"),
            @ApiResponse(code = 401, message = "인증 실패"),
            @ApiResponse(code = 404, message = "사용자 없음"),
            @ApiResponse(code = 500, message = "서버 오류")
    })
    public ResponseEntity<? extends BaseResponseBody> create (
            @ApiParam(value="댓글 작성", readOnly = true) @RequestBody ReplyPostReq replyPostReq,
            @RequestParam Integer boardId, @ApiIgnore Authentication authentication
    ) throws Exception {
        SsafyUserDetails userDetails = (SsafyUserDetails) authentication.getDetails();
        String userId = userDetails.getUsername();
        User user = userService.getUserByUserEmail(userId);
        Board board = boardService.findByBoardId(boardId);

        Reply reply = Reply.builder()
                        .replyContent(replyPostReq.getReplyContent())
                        .user(user)
                        .board(board)
                        .build();

        replyService.createReply(reply);
        return ResponseEntity.status(200).body(BaseResponseBody.of(200, "Success"));
    }


    @PutMapping("")
    @ApiOperation(value = "댓글 수정", notes = "댓글을 수정한다.")
    @ApiResponses({
            @ApiResponse(code = 200, message = "성공"),
            @ApiResponse(code = 401, message = "인증 실패"),
            @ApiResponse(code = 404, message = "사용자 없음"),
            @ApiResponse(code = 500, message = "서버 오류")
    })
    public ResponseEntity<? extends BaseResponseBody> modify (
            @ApiParam(value = "댓글 수정", required = true)  @RequestBody ReplyUpdateReq replyUpdateReq,
            @RequestParam Integer boardId, @ApiIgnore Authentication authentication
    ) throws Exception {
        SsafyUserDetails userDetails = (SsafyUserDetails) authentication.getDetails();
        String userId = userDetails.getUsername();
        User user = userService.getUserByUserEmail(userId);
        Board board = boardService.findByBoardId(boardId);

        Reply reply = replyService.searchReply(replyUpdateReq.getReplyId());
        reply.setReplyContent(replyUpdateReq.getReplyContent());

        replyService.modifyReply(reply);
        return ResponseEntity.status(200).body(BaseResponseBody.of(200, "Success"));
    }

    @DeleteMapping("")
    @ApiOperation(value = "댓글 삭제", notes = "댓글을 삭제한다")
    @ApiResponses({
            @ApiResponse(code = 200, message = "성공"),
            @ApiResponse(code = 401, message = "인증 실패"),
            @ApiResponse(code = 404, message = "사용자 없음"),
            @ApiResponse(code = 500, message = "서버 오류")
    })
    public ResponseEntity<?> delete (@RequestParam Integer replyId) {

        replyService.deleteReply(replyId);
        return ResponseEntity.status(200).body(BaseResponseBody.of(200, "Success"));
    }

    @GetMapping("")
    @ApiOperation(value = "댓글 조회", notes = "댓글을 조회한다")
    @ApiResponses({
            @ApiResponse(code = 200, message = "성공"),
            @ApiResponse(code = 401, message = "인증 실패"),
            @ApiResponse(code = 404, message = "사용자 없음"),
            @ApiResponse(code = 500, message = "서버 오류")
    })
    public ResponseEntity<List<Reply>> getAllReply(){
        return new ResponseEntity<>(replyService.searchAllReply(), HttpStatus.OK);
    }
}
