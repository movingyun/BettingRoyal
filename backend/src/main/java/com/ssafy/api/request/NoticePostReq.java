package com.ssafy.api.request;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@ApiModel("NoticePostRequest")
public class NoticePostReq {

    @ApiModelProperty(name="noticeTitle", example = "공지사항 입니다.")
    String noticeTitle;
    @ApiModelProperty(name="noticeContent", example = "공지내용")
    String noticeContent;
}
