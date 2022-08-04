package com.ssafy.api.controller;

import com.ssafy.api.request.*;
import com.ssafy.api.service.BoardService;
import com.ssafy.api.service.NoticeService;
import com.ssafy.api.service.UserService;
import com.ssafy.common.auth.SsafyUserDetails;
import com.ssafy.common.model.response.BaseResponseBody;
import com.ssafy.db.entity.Board;
import com.ssafy.db.entity.Noticeboard;
import com.ssafy.db.entity.User;
import io.swagger.annotations.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import springfox.documentation.annotations.ApiIgnore;

@Api(value = "유저 API", tags = {"Board"})
@RestController
@RequestMapping("/api/board")
public class BoardController {
    @Autowired
    BoardService boardService;
    @Autowired
    UserService userService;

    @PostMapping("")
    @ApiOperation(value = "게시판 작성", notes = "게시판을 작성한다")
    @ApiResponses({
            @ApiResponse(code = 200, message = "성공"),
            @ApiResponse(code = 401, message = "인증 실패"),
            @ApiResponse(code = 404, message = "사용자 없음"),
            @ApiResponse(code = 500, message = "서버 오류")
    })
    public ResponseEntity<? extends BaseResponseBody> create(
            @ApiParam(value="게시판 작성", readOnly = true) @RequestBody BoardPostReq boardPostReq,
            @ApiIgnore Authentication authentication
    ) throws Exception {
        SsafyUserDetails userDetails = (SsafyUserDetails) authentication.getDetails();
        String userId = userDetails.getUsername();
        User user = userService.getUserByUserEmail(userId);

        boardService.createBoard(boardPostReq, user);
        return ResponseEntity.status(200).body(BaseResponseBody.of(200, "Success"));
    }

    @GetMapping("")
    @ApiOperation(value = "게시판 조회", notes = "게시판을 조회한다.")
    @ApiResponses({
            @ApiResponse(code = 200, message = "성공"),
            @ApiResponse(code = 401, message = "인증 실패"),
            @ApiResponse(code = 404, message = "사용자 없음"),
            @ApiResponse(code = 500, message = "서버 오류")
    })
    public ResponseEntity<Board> findBoardId (
            @ApiParam(value="게시판 조회") Integer boardId ,@ApiIgnore Authentication authentication) {
        Board board = boardService.findByBoardId(boardId);
        return new ResponseEntity<>(board, HttpStatus.OK);
    }

    @PutMapping("")
    @ApiOperation(value = "게시판 수정", notes = "게시판을 수정한다.")
    @ApiResponses({
            @ApiResponse(code = 200, message = "성공"),
            @ApiResponse(code = 401, message = "인증 실패"),
            @ApiResponse(code = 404, message = "사용자 없음"),
            @ApiResponse(code = 500, message = "서버 오류")
    })
    public ResponseEntity<? extends BaseResponseBody> modify (
            @ApiParam(value = "게시판 수정", required = true)  @RequestBody BoardUpdateReq boardUpdateReq,
            @ApiIgnore Authentication authentication
        ) throws Exception {
        SsafyUserDetails userDetails = (SsafyUserDetails) authentication.getDetails();
        String userId = userDetails.getUsername();
        User user = userService.getUserByUserEmail(userId);

        Board board = boardService.updateBoard(boardUpdateReq, user );
        return ResponseEntity.status(200).body(BaseResponseBody.of(200, "Success"));
    }

    @DeleteMapping("")
    @ApiOperation(value = "게시판 삭제", notes = "게시판을 삭제한다")
    @ApiResponses({
            @ApiResponse(code = 200, message = "성공"),
            @ApiResponse(code = 401, message = "인증 실패"),
            @ApiResponse(code = 404, message = "사용자 없음"),
            @ApiResponse(code = 500, message = "서버 오류")
    })
    public ResponseEntity<?> delete (@RequestBody BoardDeleteReq boardDeleteReq, @ApiIgnore Authentication authentication) {
        SsafyUserDetails userDetails = (SsafyUserDetails) authentication.getDetails();
        String userId = userDetails.getUsername();
        User user = userService.getUserByUserEmail(userId);

        Integer boardId = boardDeleteReq.getBoardId();
        boardService.deleteBoard(boardId);
        return ResponseEntity.status(200).body(BaseResponseBody.of(200, "Success"));
    }

}
