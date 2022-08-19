package com.ssafy.api.response;

import com.ssafy.common.model.response.BaseResponseBody;
import com.ssafy.db.entity.User;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Getter;
import lombok.Setter;

import java.util.Date;

/**
 * 회원 본인 정보 조회 API ([GET] /api/v1/users/me) 요청에 대한 응답값 정의.
 */
@Getter
@Setter
@ApiModel("UserResponse")
public class UserRes{
//	@ApiModelProperty(name="User ID")
//	String userId;
//
//	public static UserRes of(User user) {
//		UserRes res = new UserRes();
//		res.setUserId(user.getUserEmail());
//		return res;
//	}

	@ApiModelProperty(name = "userCreate(가입일자)", example = "2022-08-03 17:10:03")
	private Date userCreate;

	@ApiModelProperty(name = "userNickname", example = "올인봇")
	private String userNickname;

	@ApiModelProperty(name = "userRuby", example = "1000")
	private Integer userRuby;

	@ApiModelProperty(name = "userGuild", example = "길드명")
	private String userGuild;

	@ApiModelProperty(name = "userGameCount(전체 게임 횟수)", example = "438")
	private Integer userGameCount;

	@ApiModelProperty(name = "userGender", example = "M")
	private String userGender;

	@ApiModelProperty(name = "userVault", example = "10000")
	private Integer userVault;

	@ApiModelProperty(name = "userWin(승수)", example = "300")
	private Integer userWin;
}
