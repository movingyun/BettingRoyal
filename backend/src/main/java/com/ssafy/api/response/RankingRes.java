package com.ssafy.api.response;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@ApiModel("RankResponse")
public class RankingRes {
    @ApiModelProperty(name = "rank", example = "1")
    private Integer id;

    @ApiModelProperty(name = "userNickname", example = "싸피")
    private String nickname;

    @ApiModelProperty(name = "userRuby", example = "1000")
    private Integer ruby;

    @ApiModelProperty(name = "userGuild", example = "길드명")
    private String guild;

}
