package com.ssafy.api.response;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.ssafy.db.entity.Badge;
import com.ssafy.db.entity.User;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.*;
import org.hibernate.annotations.DynamicInsert;
import org.hibernate.annotations.DynamicUpdate;

import javax.persistence.*;
import java.util.Date;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ApiModel("BadgeOwnResponse")
public class BadgeOwnRes {

    @ApiModelProperty(name="badgeOwnId")
    private Integer badgeOwnId;

    @ApiModelProperty(name="badge")
    private Badge badge;

    @ApiModelProperty(name="badgeOwnIsUsing")
    private Boolean badgeOwnIsUsing;

}
