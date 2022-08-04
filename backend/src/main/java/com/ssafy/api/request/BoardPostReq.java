package com.ssafy.api.request;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@ApiModel("BoardPostRequest")
public class BoardPostReq {
    @ApiModelProperty(name="boardTitle", example = "게시판 입니다.")
    String boardTitle;
    @ApiModelProperty(name="boardContent", example = "게시판 내용")
    String boardContent;
}
