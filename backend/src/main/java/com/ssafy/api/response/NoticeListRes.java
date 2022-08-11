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
    Integer noticeId;
    @ApiModelProperty(name="공지사항 제목", example="this is notice title")
    String noticeTitle;
    @ApiModelProperty(name="공지사항 생성 날짜", example="2022-02-04 14:07:48.206444")
    Date noticeDate;
    @ApiModelProperty(name="공지사항 수정 날짜", example="2022-02-05 09:12:44.135632")
    Integer noticeHit;

    public NoticeListRes(Noticeboard entity) {
        this.noticeId = entity.getNoticeboardId();
        this.noticeTitle = entity.getNoticeboardTitle();
        this.noticeDate = entity.getNoticeboardDate();
        this.noticeHit = entity.getNoticeboardHit();
    }
}
