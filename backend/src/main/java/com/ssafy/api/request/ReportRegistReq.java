package com.ssafy.api.request;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@ApiModel("ReportRegistRequest")
public class ReportRegistReq {

    @ApiModelProperty(name="reportReason", example = "욕설 신고 합니다.")
    private String reportReason;

    @ApiModelProperty(name="reportBlackUserId", example = "1")
    private int reportBlackUserId;
}
