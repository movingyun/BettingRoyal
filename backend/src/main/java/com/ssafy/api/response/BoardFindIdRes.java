package com.ssafy.api.response;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ApiModel("BoardFindIdResponse")
public class BoardFindIdRes {
    @ApiModelProperty(name="userNickname")
    String userNickname;
    @ApiModelProperty(name="boardId")
    Integer boardId;
    @ApiModelProperty(name="boardTitle")
    String boardTitle;
    @ApiModelProperty(name="boardContent")
    String boardContent;
    @ApiModelProperty(name="boardDate")
    Date boardDate;
    @ApiModelProperty(name="boardHit")
    Integer boardHit;
    @ApiModelProperty(name="boardLike", example="30")
    Integer boardLike;
    //내가 좋아요 했는지 여부
    @ApiModelProperty(name="isLike", example="true")
    boolean isLike;


}
