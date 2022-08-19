package com.ssafy.api.request;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;
import javax.validation.constraints.Size;

@Getter
@Setter
@ToString
@ApiModel("UserUpdateRequest")
public class UserModifyReq {

    @ApiModelProperty(name = "닉네임")
    @NotNull(message = "Nickname should not be empty.")
    @Size(min=2, max =8)
    @Pattern(regexp = "^[0-9a-zA-Z가-힣]*$",
            message = "닉네임은 한글/숫자/영어만 가능합니다.")
    private String modifyNickname;

//    @ApiModelProperty(name =  "M: 남자, F: 여자", allowableValues = "M, F")
//    String modifyGender;

}
