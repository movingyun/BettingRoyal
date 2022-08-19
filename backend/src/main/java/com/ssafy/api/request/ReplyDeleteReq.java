package com.ssafy.api.request;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@ApiModel("ReplyDeleteRequest")
public class ReplyDeleteReq {
    @ApiModelProperty(name="replyId")
    Integer replyId;
}
