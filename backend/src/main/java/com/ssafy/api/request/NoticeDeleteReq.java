package com.ssafy.api.request;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@ApiModel("NoticeDeleteRequest")
public class NoticeDeleteReq {
    @ApiModelProperty(name="noticeId")
    Integer noticeId;

}

