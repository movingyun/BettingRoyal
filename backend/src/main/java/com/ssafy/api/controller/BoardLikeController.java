package com.ssafy.api.controller;

import com.ssafy.api.service.BoardLikeService;
import com.ssafy.api.service.BoardService;
import com.ssafy.api.service.UserService;
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
        this.boardLikeService.clickBoardLikes(boardId, authentication.getName());
    }

    @DeleteMapping("/boardId}")
    @ApiOperation(value = "좋아요 삭제", notes = "게시물에 대한 좋아요를 삭제한다.")
    public void deleteLike(@PathVariable Integer boardId,@ApiIgnore Authentication authentication ) {
        this.boardLikeService.clickBoardUnLikes(boardId, authentication.getName());
    }

}
