package com.ssafy.api.request;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;


@Getter
@Setter
@ApiModel("UserActiveRequest")
public class UserActiveReq {

    @ApiModelProperty(name="userId")
    private Integer userId;

    @ApiModelProperty(name="userIsActive")
    private Integer userIsActive;
}
