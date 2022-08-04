package com.ssafy.api.request;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Getter;
import lombok.Setter;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

/**
 * 유저 로그인 API ([POST] /api/v1/auth/login) 요청에 필요한 리퀘스트 바디 정의.
 */
@Getter
@Setter
@ApiModel("UserLoginPostRequest")
public class UserLoginPostReq {

	@ApiModelProperty(name="유저 Email", example="ssafy@domain.com")
	@NotNull(message = "Password should not be empty.")
	@Email(message = "이메일 형식이 아닙니다.")
	@Size(max=100)
	private String userEmail;

	@ApiModelProperty(name="유저 Password", example="string")
	@NotNull(message = "Password should not be empty.")
	private String userPw;
}
