package com.ssafy.api.controller;

import com.ssafy.api.service.BoardLikeService;
import com.ssafy.api.service.BoardService;
import com.ssafy.api.service.UserService;
import com.ssafy.common.auth.SsafyUserDetails;
import com.ssafy.db.entity.User;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import springfox.documentation.annotations.ApiIgnore;

@Api(value = "유저 API", tags = {"BoardLike"})
@RestController
@RequestMapping("/api/board")
public class BoardLikeController {

    @Autowired
    BoardLikeService boardLikeService;

    @Autowired
    UserService userService;

    @Autowired
    BoardService boardService;

    @PostMapping("{boardId}")
    @ApiOperation(value = "좋아요 생성", notes = "게시물에 대한 좋아요를 생성한다.")
    public void createLike(@PathVariable Integer boardId,@ApiIgnore Authentication authentication ) {
        //로그인 한 user정보 찾아오는 code
        //스켈레톤 코드 UserController에서 가져옴
        SsafyUserDetails userDetails = (SsafyUserDetails) authentication.getDetails();
        String userEmail = userDetails.getUsername();
        User user = userService.getUserByUserEmail(userEmail);

        boardLikeService.clickBoardLikes(boardId, user);
    }


    @DeleteMapping("{boardId}")
    @ApiOperation(value = "좋아요 삭제", notes = "게시물에 대한 좋아요를 삭제한다.")
    public void deleteLike(@PathVariable Integer boardId,@ApiIgnore Authentication authentication ) {
        //로그인 한 user정보 찾아오는 code
        //스켈레톤 코드 UserController에서 가져옴
        SsafyUserDetails userDetails = (SsafyUserDetails) authentication.getDetails();
        String userEmail = userDetails.getUsername();
        User user = userService.getUserByUserEmail(userEmail);

        boardLikeService.clickBoardUnLikes(boardId, user);
    }

}
