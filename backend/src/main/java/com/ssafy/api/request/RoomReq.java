package com.ssafy.api.request;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@ApiModel("RoomReq")
public class RoomReq {

    @ApiModelProperty(name="roomTitle", example = "abc")
    String roomTitle;
    @ApiModelProperty(name="roomBettingUnit", example = "1")
    int roomBettingUnit;
}
