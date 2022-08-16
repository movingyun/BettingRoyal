package com.ssafy.api.response;

import com.ssafy.db.entity.User;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.*;
import org.hibernate.annotations.DynamicInsert;
import org.hibernate.annotations.DynamicUpdate;

import javax.persistence.*;


@Getter
@Setter
@ApiModel("RoomResponse")
public class RoomRes {
    @ApiModelProperty(name = "id", example = "1")
    private int id;

    @ApiModelProperty(name = "roomTitle", example = "방제목")
    private String roomTitle;

    @ApiModelProperty(name = "roomBettingUnit", example = "1")
    private int roomBettingUnit;

    @ApiModelProperty(name = "roomPw", example = "0")
    private Integer roomPw;

    //roomIsStart의 default값은 false로 준다.
    @ApiModelProperty(name = "roomIsStart", example = "false")
    private boolean roomIsStart;

    //roomIsClose의 default값은 false로 준다.
    @ApiModelProperty(name = "roomIsClose", example = "false")
    private boolean roomIsClose;

    //만들어지면 방장이 만들었지만 방장도 입장 이벤트를 하기 때문에 0으로 기본값 후 더해줌
    @ApiModelProperty(name = "roomInCnt", example = "0")
    private int roomInCnt;

}