package com.ssafy.api.response;

import com.ssafy.db.entity.Noticeboard;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Getter;
import lombok.Setter;

import java.util.Date;

@Getter
@Setter
@ApiModel("NoticeListResponse")
public class NoticeListRes {
    @ApiModelProperty(name="seq", example="1")
    Integer id;
    @ApiModelProperty(name="공지사항 제목", example="this is notice title")
    String noticeTitle;
    @ApiModelProperty(name="공지사항 생성 날짜", example="2022-02-04")
    String noticeDate;
    @ApiModelProperty(name="공지사항 조회수", example="20")
    Integer noticeHit;
    @ApiModelProperty(name="작성자", example="김싸피")
    String userNickname;

//    public NoticeListRes(Noticeboard entity) {
//        this.noticeId = entity.getNoticeboardId();
//        this.noticeTitle = entity.getNoticeboardTitle();
//        this.noticeDate = entity.getNoticeboardDate();
//        this.noticeHit = entity.getNoticeboardHit();
//        this.userNickname = entity.getUser().getUserNickname();
//    }
}
