package com.ssafy.api.request;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@ApiModel("BadgeModifyReqest")
public class BadgeModifyReq {

    @ApiModelProperty(name="badgeId", example = "1")
    int badgeId;

    @ApiModelProperty(name="badgeName", example = "새싹")
    String badgeName;

    @ApiModelProperty(name="badgeImg", example = "새싹.jpg")
    String badgeImg;

    @ApiModelProperty(name="badgeCondition", example = "게임 한 판 하기")
    String badgeCondition;
}
