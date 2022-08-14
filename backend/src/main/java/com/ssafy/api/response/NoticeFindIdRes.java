package com.ssafy.api.response;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ApiModel("NoticeFindIdResponse")
public class NoticeFindIdRes {
    @ApiModelProperty(name="userNickname")
    String userNickname;
    @ApiModelProperty(name="noticeId")
    Integer noticeId;
    @ApiModelProperty(name="noticeTitle")
    String noticeTitle;
    @ApiModelProperty(name="NoticeContent")
    String noticeContent;
    @ApiModelProperty(name="noticeDate")
    Date noticeDate;
    @ApiModelProperty(name="noticeHit")
    Integer noticeHit;

}
