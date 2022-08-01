package com.ssafy.api.controller;

import com.ssafy.api.request.UserModifyReq;
import com.ssafy.common.model.response.BaseResponseBody;
import io.swagger.annotations.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;

import org.springframework.web.bind.annotation.*;

import com.ssafy.api.response.UserRes;
import com.ssafy.api.service.UserService;
import com.ssafy.db.entity.User;
//import com.ssafy.db.repository.UserRepositorySupport;


/**
 * 유저 관련 API 요청 처리를 위한 컨트롤러 정의.
 */
@Api(value = "유저 API", tags = {"User"})
@RestController
@RequestMapping("/api/user")

public class UserController {
	
	@Autowired
	UserService userService;
	@Autowired
	PasswordEncoder passwordEncoder;

	@GetMapping("{userId}")
	@ApiOperation(value = "회원 정보 조회", notes = "아이디로 로그인한 회원 본인의 정보를 응답한다.")
    @ApiResponses({
        @ApiResponse(code = 200, message = "성공"),
        @ApiResponse(code = 401, message = "인증 실패"),
        @ApiResponse(code = 404, message = "사용자 없음"),
        @ApiResponse(code = 500, message = "서버 오류")
    })
	public ResponseEntity<UserRes> isUserEmailDuplicate(String userEmail) {
		/**
		 * 요청 헤더 액세스 토큰이 포함된 경우에만 실행되는 인증 처리이후, 리턴되는 인증 정보 객체(authentication) 통해서 요청한 유저 식별.
		 * 액세스 토큰이 없이 요청하는 경우, 403 에러({"error": "Forbidden", "message": "Access Denied"}) 발생.
		 */
		if(userService.isUserEmailDuplicate(userEmail)){
			User user = userService.getUserByUserEmail(userEmail);
			return ResponseEntity.status(200).body(UserRes.of(user));
		}
		return null;
	}


	@PutMapping("/modify")
	@ApiOperation(value = "회원 정보 수정", notes = "<strong>닉네임, 성별</strong>를 통해 정보를 수정한다.")
	@ApiResponses({
			@ApiResponse(code = 200, message = "성공"),
			@ApiResponse(code = 401, message = "인증 실패"),
			@ApiResponse(code = 404, message = "사용자 없음"),
			@ApiResponse(code = 500, message = "서버 오류")
	})
	public ResponseEntity<? extends BaseResponseBody> modify(
			@RequestBody @ApiParam(value="회원가입 정보", required = true) UserModifyReq modifyInfo) {
		//임의로 리턴된 User 인스턴스. 현재 코드는 회원 가입 성공 여부만 판단하기 때문에 굳이 Insert 된 유저 정보를 응답하지 않음.
		User user = userService.getUserByUserEmail(modifyInfo.getModifyEmail());
//		boolean check = passwordEncoder.matches(modifyInfo.getModifyPw(), user.getUserPw());
		if(false) return ResponseEntity.status(404).body(BaseResponseBody.of(404,"False"));
		else{
			user.setUserNickname(modifyInfo.getModifyNickname());
			user.setUserPw(modifyInfo.getModifyPw());
			User us = userService.modifyUser(user);
		}
		return ResponseEntity.status(200).body(BaseResponseBody.of(200, "Success"));
	}


//	@DeleteMapping("/{userId}")
//	@ApiOperation(value = "회원 탈퇴", notes = "회원 정보를 삭제한다.")
//	@ApiResponses({
//			@ApiResponse(code = 200, message = "성공"),
//			@ApiResponse(code = 401, message = "인증 실패"),
//			@ApiResponse(code = 404, message = "사용자 없음"),
//			@ApiResponse(code = 500, message = "서버 오류")
//	})
//	public ResponseEntity<?> removeuser(@ApiParam(value = "삭제할 유저 이메일", required = true)@PathVariable String userEmail){
//		userService.deleteUser(userEmail);
//		return ResponseEntity.status(200).body("OK");
//	}

	@PutMapping()
	@ApiOperation(value = "회원 비밀번호 변경", notes = "회원 아이디로 비밀번호를 변경한다.")
	@ApiResponses({
			@ApiResponse(code = 200, message = "성공"),
			@ApiResponse(code = 401, message = "인증 실패"),
			@ApiResponse(code = 404, message = "사용자 없음"),
			@ApiResponse(code = 500, message = "서버 오류")
	})
	public  ResponseEntity<? extends BaseResponseBody> findPassword
			(@RequestParam String userEmail, @RequestParam String userPw) {
		User user = userService.getUserByUserEmail(userEmail);
		user.setUserPw(userPw);
		User updatePw = userService.changeUserPw(user);
		return ResponseEntity.status(200).body(BaseResponseBody.of(200, "Success"));
	}



}
