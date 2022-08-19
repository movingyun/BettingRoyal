package com.ssafy.api.request;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Getter;
import lombok.Setter;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;
import javax.validation.constraints.Size;

/**
 * 유저 회원가입 API ([POST] /api/v1/users) 요청에 필요한 리퀘스트 바디 정의.
 */
@Getter
@Setter
@ApiModel("UserSignUpRequest")
public class UserSignUpReq {
	@ApiModelProperty(name = "이메일", allowableValues = "ssafy@domain.com")
	@NotNull(message = "Email should not be empty.")
	@Email(message = "이메일 형식이 아닙니다.")
	@Pattern(regexp = "[a-zA-z0-9]+@[a-zA-z]+[.]+[a-zA-z.]+")
	@Size(max=100)
	private String userEmail;

	@ApiModelProperty(name = "비밀번호" )
	@NotNull(message = "Password should not be empty.")
	@Pattern(regexp = "^(?=.*[A-Za-z])(?=.*\\d)(?=.*[~?!@#$%^&*()+|=])[A-Za-z\\d~?!@#$%^&*()+|=]{8,}$",
			message = "비밀번호는 영문/숫자/특수문자 각 1자 이상 포함하여 최소 8자여야 합니다.")
	private String userPw;

	@ApiModelProperty(name = "닉네임")
	@NotNull(message = "Nickname should not be empty.")
	@Size(min=2, max =8)
	@Pattern(regexp = "^[0-9a-zA-Z가-힣]*$",
			message = "닉네임은 한글/숫자/영어만 가능합니다.")
	private String userNickname;

	@ApiModelProperty(name =  "M: 남자, F: 여자", allowableValues = "M, F")
	@NotNull(message = "Gender should not be empty.")
	private String userGender;
}
