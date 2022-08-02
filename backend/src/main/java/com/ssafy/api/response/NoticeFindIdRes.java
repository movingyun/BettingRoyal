package com.ssafy.api.response;

import com.ssafy.db.entity.Noticeboard;
import com.ssafy.db.entity.User;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Getter;
import lombok.Setter;

import java.util.Date;

@Getter
@Setter
@ApiModel("NoticeFindIdResponse")
public class NoticeFindIdRes {
    @ApiModelProperty(name="UserId")
    User user;
    @ApiModelProperty(name="NoticeId")
    Integer noticeId;
    @ApiModelProperty(name="NoticeTitle")
    String noticeTitle;
    @ApiModelProperty(name="NoticeContent")
    String noticeContent;
    @ApiModelProperty(name="NoticeDate")
    Date noticeDate;
    @ApiModelProperty(name="NoticeHit")
    Integer noticeDHit;

    public static NoticeFindIdRes of(Noticeboard notice){
        NoticeFindIdRes res = new NoticeFindIdRes();
        res.setUser(notice.getUser());
        res.setNoticeId(notice.getNoticeboardId());
        res.setNoticeTitle(notice.getNoticeboardTitle());
        res.setNoticeContent(notice.getNoticeboardContent());
        res.setNoticeDate(notice.getNoticeboardDate());
        res.setNoticeDHit(notice.getNoticeboardHit());
        return res;
    }
}
