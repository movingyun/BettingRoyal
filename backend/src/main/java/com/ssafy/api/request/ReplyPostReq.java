package com.ssafy.api.request;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@ApiModel("ReplyPostRequest")
public class ReplyPostReq {
    @ApiModelProperty(name="Reply", example = "댓글 내용")
    String replyContent;
}
