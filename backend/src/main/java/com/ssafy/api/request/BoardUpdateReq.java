package com.ssafy.api.request;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@ApiModel("BoardUpdateReq")
public class BoardUpdateReq {

    @ApiModelProperty(name="boardId")
    Integer boardId;
    @ApiModelProperty(name="boardTitle", example = "게시판입니다.")
    String boardTitle;
    @ApiModelProperty(name="boardContent", example = "게시판 내용")
    String boardContent;
}
