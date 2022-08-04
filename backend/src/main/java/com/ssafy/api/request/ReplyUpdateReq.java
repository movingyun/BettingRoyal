package com.ssafy.api.request;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@ApiModel("ReplyUpdateReq")
public class ReplyUpdateReq {

    @ApiModelProperty(name="replyId")
    Integer ReplyId;

    @ApiModelProperty(name="replyContent", example = "댓글 내용")
    String replyContent;
}
