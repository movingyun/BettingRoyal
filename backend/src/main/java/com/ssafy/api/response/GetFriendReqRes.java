package com.ssafy.api.response;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@ApiModel("FriendReqResponse")
public class GetFriendReqRes {
    @ApiModelProperty(name = "id", example = "1")
    private Integer id;

    @ApiModelProperty(name = "nickname", example = "싸피")
    private String nickname;

    @ApiModelProperty(name = "ruby", example = "1000")
    private Integer ruby;

    @ApiModelProperty(name = "friendId", example = "친구아이디")
    private Integer friendId;

}
