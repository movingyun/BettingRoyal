package com.ssafy.api.controller;

import com.ssafy.api.request.UserSignUpReq;
import com.ssafy.api.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import com.ssafy.api.request.UserLoginPostReq;
import com.ssafy.api.response.UserLoginPostRes;
import com.ssafy.common.model.response.BaseResponseBody;
import com.ssafy.common.util.JwtTokenUtil;
import com.ssafy.db.entity.User;
//import com.ssafy.db.repository.UserRepositorySupport;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import io.swagger.annotations.ApiResponses;
import io.swagger.annotations.ApiResponse;

import java.util.HashMap;
import java.util.Random;

/**
 * 인증 관련 API 요청 처리를 위한 컨트롤러 정의.
 */
@Api(value = "인증 API", tags = {"Auth."})
@RestController
@RequestMapping("/api/auth")
public class AuthController {
	@Autowired
	UserService userService;
	@Autowired
	PasswordEncoder passwordEncoder;

	@PostMapping("/signup")
	@ApiOperation(value = "회원 가입", notes = "<strong>이메일과 패스워드</strong>를 통해 회원가입 한다.")
	@ApiResponses({
			@ApiResponse(code = 200, message = "성공"),
			@ApiResponse(code = 401, message = "인증 실패"),
			@ApiResponse(code = 404, message = "사용자 없음"),
			@ApiResponse(code = 500, message = "서버 오류")
	})
	public ResponseEntity<? extends BaseResponseBody> register(
			@RequestBody @ApiParam(value="회원가입 정보", required = true) UserSignUpReq signUpInfo) {
			//임의로 리턴된 User 인스턴스. 현재 코드는 회원 가입 성공 여부만 판단하기 때문에 굳이 Insert 된 유저 정보를 응답하지 않음.
			if (userService.isUserEmailDuplicate(signUpInfo.getUserEmail())){
				return ResponseEntity.status(404).body(BaseResponseBody.of(404,"Fail"));
			} else if(userService.isUserNicknameDuplicate(signUpInfo.getUserNickname())) {
				return ResponseEntity.status(404).body(BaseResponseBody.of(404,"Fail"));
			} else {
				User user = userService.signUp(signUpInfo);
			}
			return ResponseEntity.status(200).body(BaseResponseBody.of(200, "Success"));
	}
	
	@PostMapping("/login")
	@ApiOperation(value = "로그인", notes = "<strong>이메일과 패스워드</strong>를 통해 로그인 한다.")
    @ApiResponses({
        @ApiResponse(code = 200, message = "성공", response = UserLoginPostRes.class),
        @ApiResponse(code = 401, message = "인증 실패", response = BaseResponseBody.class),
        @ApiResponse(code = 404, message = "사용자 없음", response = BaseResponseBody.class),
        @ApiResponse(code = 500, message = "서버 오류", response = BaseResponseBody.class)
    })
	public ResponseEntity<UserLoginPostRes> login (@RequestBody @ApiParam(value="로그인 정보", required = true) UserLoginPostReq loginInfo) {
		String userEmail = loginInfo.getUserEmail();
		String userPw = loginInfo.getUserPw();

		User user = userService.getUserByUserEmail(userEmail);
		// 로그인 요청한 유저로부터 입력된 패스워드 와 디비에 저장된 유저의 암호화된 패스워드가 같은지 확인.(유효한 패스워드인지 여부 확인)
		if(passwordEncoder.matches(userPw, user.getUserPw())) {
			// 유효한 패스워드가 맞는 경우, 로그인 성공으로 응답.(액세스 토큰을 포함하여 응답값 전달)
			return ResponseEntity.ok(UserLoginPostRes.of(200, "Success", "Bearer " + JwtTokenUtil.getToken(userEmail)));
		}
		// 유효하지 않는 패스워드인 경우, 로그인 실패로 응답.
		return ResponseEntity.status(401).body(UserLoginPostRes.of(401, "Invalid Password", null));
	}

	@ResponseBody
	@PostMapping("/kakaologin")
	@ApiResponses({
			@ApiResponse(code = 200, message = "성공", response = UserLoginPostRes.class),
			@ApiResponse(code = 401, message = "인증 실패", response = BaseResponseBody.class),
			@ApiResponse(code = 404, message = "사용자 없음", response = BaseResponseBody.class),
			@ApiResponse(code = 500, message = "서버 오류", response = BaseResponseBody.class)
	})
	public ResponseEntity<UserLoginPostRes>  kakaologin(@RequestParam String code,
			@RequestBody @ApiParam(value="로그인 정보", required = true) UserLoginPostReq loginInfo)  {
		String access_Token = userService.getKaKaoAccessToken(code);
		HashMap<String, Object> userInfo = userService.getKakaoUser(access_Token);
		Object userEmail = userInfo.get("email");
		Object nickname = userInfo.get("nickname");

		UserSignUpReq userSignUpReq= new UserSignUpReq();
		userSignUpReq.setUserEmail(userEmail.toString());

		Random rnd = new Random();
		String randomStr = "";
		for(int i=0; i<3; i++){
			randomStr += String.valueOf((char) ((int) (rnd.nextInt(26)) + 97));
		}

		userSignUpReq.setUserNickname(nickname.toString()+randomStr);
		userSignUpReq.setUserPw("faASd156!@#156SDASCQWE@G");

		if(userService.checkNickname(nickname.toString())){
			return ResponseEntity.ok(UserLoginPostRes.of(200, "Success", JwtTokenUtil.getToken(userEmail.toString())));
		} else {
			userService.signUp(userSignUpReq);
			return ResponseEntity.ok(UserLoginPostRes.of(200, "Success", JwtTokenUtil.getToken(userEmail.toString())));
		}

	}
}
