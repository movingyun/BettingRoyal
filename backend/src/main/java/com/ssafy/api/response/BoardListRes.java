package com.ssafy.api.response;

import com.ssafy.db.entity.Board;
import com.ssafy.db.entity.Noticeboard;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Getter;
import lombok.Setter;

import java.util.Date;

@Getter
@Setter
@ApiModel("BoardListResponse")
public class BoardListRes {
    @ApiModelProperty(name="seq", example="1")
    Integer Id;
    @ApiModelProperty(name="게시판 제목", example="this is board title")
    String boardTitle;
    @ApiModelProperty(name="게시판 생성 날짜", example="2022-02-04")
    String boardDate;
    @ApiModelProperty(name="게시판 조회수", example="30")
    Integer boardHit;
    @ApiModelProperty(name="게시판 좋아요수", example="30")
    Integer boardLike;
    @ApiModelProperty(name="작성자", example="김싸피")
    String userNickname;

//    public BoardListRes(Board entity) {
//        this.boardId = entity.getBoardId();
//        this.boardTitle = entity.getBoardTitle();
//        this.boardDate = entity.getBoardDate();
//        this.boardHit = entity.getBoardHit();
//        this.boardLike = entity.getBoardLike();
//    }
}
