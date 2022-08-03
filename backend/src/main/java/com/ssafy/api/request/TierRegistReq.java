package com.ssafy.api.request;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@ApiModel("TierRegistRequest")
public class TierRegistReq {

    @ApiModelProperty(name="tierName", example = "골드")
    private String tierName;

    @ApiModelProperty(name="tierImg", example = "gold.jpg")
    private String tierImg;
}
