package com.ssafy.api.request;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@ApiModel("VaultReq")
public class VaultReq {

    @ApiModelProperty(name="deposit", example = "1")
    int deposit;
}
