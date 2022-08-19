package com.ssafy.api.controller;

import com.ssafy.api.request.*;
import com.ssafy.api.response.BoardFindIdRes;
import com.ssafy.api.response.BoardListRes;
import com.ssafy.api.response.NoticeListRes;
import com.ssafy.api.service.BoardLikeService;
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

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@Api(value = "유저 API", tags = {"Board"})
@RestController
@RequestMapping("/api/board")
public class BoardController {
    @Autowired
    BoardService boardService;
    @Autowired
    UserService userService;
    @Autowired
    BoardLikeService boardLikeService;

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

    @GetMapping("{boardId}")
    @ApiOperation(value = "게시판 조회", notes = "게시판을 조회한다.")
    @ApiResponses({
            @ApiResponse(code = 200, message = "성공"),
            @ApiResponse(code = 401, message = "인증 실패"),
            @ApiResponse(code = 404, message = "사용자 없음"),
            @ApiResponse(code = 500, message = "서버 오류")
    })
    public ResponseEntity<BoardFindIdRes> findBoardId (
            @ApiParam(value="게시판 조회") @PathVariable Integer boardId ,@ApiIgnore Authentication authentication) {
        SsafyUserDetails userDetails = (SsafyUserDetails) authentication.getDetails();
        String userId = userDetails.getUsername();
        User user = userService.getUserByUserEmail(userId);

        Board board = boardService.findByBoardId(boardId);
        BoardFindIdRes res = new BoardFindIdRes();
        res.setBoardId(board.getBoardId());
        res.setBoardTitle(board.getBoardTitle());
        res.setBoardContent(board.getBoardContent());
        res.setBoardHit(board.getBoardHit());
        res.setBoardDate(board.getBoardDate());
        res.setBoardLike(board.getBoardLike());
        res.setUserNickname(board.getUser().getUserNickname());
        res.setLike(boardLikeService.checkIsLike(board.getBoardId(), user.getUserId()));
        return new ResponseEntity<>(res, HttpStatus.OK);
    }

    @GetMapping("")
    @ApiOperation(value = "게시판 목록 조회", notes = "게시판을 조회한다.")
    @ApiResponses({
            @ApiResponse(code = 200, message = "성공"),
            @ApiResponse(code = 401, message = "인증 실패"),
            @ApiResponse(code = 404, message = "사용자 없음"),
            @ApiResponse(code = 500, message = "서버 오류")
    })
    public ResponseEntity<List<BoardListRes>> getBoardList (
            @ApiIgnore Authentication authentication) {

        List<Board> lists = boardService.boardList();
        List<BoardListRes> boardListRes = new ArrayList<>();
        Collections.reverse(lists);
        SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy년 MM월 dd일");

        for(Board list : lists) {
            BoardListRes res = new BoardListRes();
            res.setId(list.getBoardId());
            res.setBoardTitle(list.getBoardTitle());
            res.setUserNickname(list.getUser().getUserNickname());
            res.setBoardDate(simpleDateFormat.format(list.getBoardDate()));
            res.setBoardHit(list.getBoardHit());
            boardListRes.add(res);
        }
        return new ResponseEntity<>(boardListRes, HttpStatus.OK);
    }

    @PutMapping("{boardId}")
    @ApiOperation(value = "게시판 수정", notes = "게시판을 수정한다.")
    @ApiResponses({
            @ApiResponse(code = 200, message = "성공"),
            @ApiResponse(code = 401, message = "인증 실패"),
            @ApiResponse(code = 404, message = "사용자 없음"),
            @ApiResponse(code = 500, message = "서버 오류")
    })
    public ResponseEntity<? extends BaseResponseBody> modify (
            @ApiParam(value = "게시판 수정", required = true)
            @RequestBody BoardUpdateReq boardUpdateReq,
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
