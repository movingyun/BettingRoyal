package com.ssafy.api.request;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@ApiModel("BoardLikeRequest")
public class BoardLikeReq {
    public class BoardUpdateReq {
        @ApiModelProperty(name="boardLikeId", example = "1")
        private Integer boardLikeId;
        @ApiModelProperty(name="boardId", example = "1")
        private Integer boardId;
        @ApiModelProperty(name="userId", example = "1")
        private Integer userId;
    }
}
