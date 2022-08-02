package com.ssafy.api.request;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Getter;
import lombok.Setter;
import org.springframework.stereotype.Service;

@Getter
@Setter
@ApiModel("NoticeUpdateReq")
public class NoticeUpdateReq {

    @ApiModelProperty(name="noticeId")
    Integer noticeId;
    @ApiModelProperty(name="noticeTitle", example = "공지사항입니다.")
    String noticeTitle;
    @ApiModelProperty(name="noticeContent", example = "공지내용")
    String noticeContent;
}
