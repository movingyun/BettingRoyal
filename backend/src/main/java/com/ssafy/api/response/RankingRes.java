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
    @ApiModelProperty(name = "id", example = "1")
    private Integer id;

    @ApiModelProperty(name = "nickname", example = "싸피")
    private String nickname;

    @ApiModelProperty(name = "ruby", example = "1000")
    private Integer ruby;

    @ApiModelProperty(name = "total", example = "전적")
    private String total;

}
