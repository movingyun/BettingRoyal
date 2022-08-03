package com.ssafy.api.request;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@ApiModel("ReportResultRequest")
public class ReportResultReq {

    @ApiModelProperty(name="reportId", example = "1")
    private int reportId;

    @ApiModelProperty(name="reportResult", example = "욕설로 인해 3일 정지.")
    private String reportResult;

}
