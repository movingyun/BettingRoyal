package com.ssafy.api.controller;

import com.ssafy.api.request.UserActiveReq;
import com.ssafy.api.request.UserModifyReq;
import com.ssafy.common.auth.SsafyUserDetails;
import com.ssafy.api.service.UserService;
import com.ssafy.common.model.response.BaseResponseBody;
import com.ssafy.db.entity.Reply;
import io.swagger.annotations.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;

import org.springframework.web.bind.annotation.*;

import com.ssafy.api.response.UserRes;
import com.ssafy.db.entity.User;
import springfox.documentation.annotations.ApiIgnore;

import java.util.List;
import java.util.Map;
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

	@GetMapping("")
	@ApiOperation(value = "내 정보 조회", notes = "아이디로 로그인한 회원 본인의 정보를 응답한다.")
    @ApiResponses({
        @ApiResponse(code = 200, message = "성공"),
        @ApiResponse(code = 401, message = "인증 실패"),
        @ApiResponse(code = 404, message = "사용자 없음"),
        @ApiResponse(code = 500, message = "서버 오류")
    })
	public ResponseEntity<User> getUser(@ApiIgnore Authentication authentication) {
		/**
		 * 요청 헤더 액세스 토큰이 포함된 경우에만 실행되는 인증 처리이후, 리턴되는 인증 정보 객체(authentication) 통해서 요청한 유저 식별.
		 * 액세스 토큰이 없이 요청하는 경우, 403 에러({"error": "Forbidden", "message": "Access Denied"}) 발생.
		 */
//		if(userService.isUserEmailDuplicate(userEmail)){
//			User user = userService.getUserByUserEmail(userEmail);
//			return ResponseEntity.status(200).body(UserRes.of(user));
//		}
//		return null;

		SsafyUserDetails userDetails = (SsafyUserDetails) authentication.getDetails();
		String userEmail = userDetails.getUsername();
		User user = userService.getUserByUserEmail(userEmail);

		return ResponseEntity.ok(user);
	}

	@PutMapping("/modify")
	@ApiOperation(value = "회원 비밀번호 변경", notes = "회원 아이디로 비밀번호를 변경한다.")
	@ApiResponses({
			@ApiResponse(code = 200, message = "성공"),
			@ApiResponse(code = 401, message = "인증 실패"),
			@ApiResponse(code = 404, message = "사용자 없음"),
			@ApiResponse(code = 500, message = "서버 오류")
	})
	public  ResponseEntity<? extends BaseResponseBody> modifyPassword
			(@RequestParam String userEmail, @RequestParam String userPw) {
		User user = userService.getUserByUserEmail(userEmail);
		user.setUserPw(userPw);
		User updatePw = userService.changeUserPw(user);
		return ResponseEntity.status(200).body(BaseResponseBody.of(200, "Success"));
	}

	@PutMapping("/modify2")
	@ApiOperation(value = "회원 닉네임 수정", notes = "회원 아이디로 회원 닉네임을 수정한다.")
	@ApiResponses({
			@ApiResponse(code = 200, message = "성공"),
			@ApiResponse(code = 401, message = "인증 실패"),
			@ApiResponse(code = 404, message = "사용자 없음"),
			@ApiResponse(code = 500, message = "서버 오류")
	}) //시작
	public ResponseEntity<String> modifyNickname (
			@RequestBody @ApiParam(value="회원가입 정보", required = true) UserModifyReq modifyInfo,  @ApiIgnore Authentication authentication) {
		/**
		 * 요청 헤더 액세스 토큰이 포함된 경우에만 실행되는 인증 처리이후, 리턴되는 인증 정보 객체(authentication) 통해서 요청한 유저 식별.
		 * 액세스 토큰이 없이 요청하는 경우, 403 에러({"error": "Forbidden", "message": "Access Denied"}) 발생.
		 */
		//로그인 한 user 정보 찾아오는 code
		//스켈레톤 코드 UserController 에서 가져옴
		SsafyUserDetails userDetails = (SsafyUserDetails) authentication.getDetails();
		String userId = userDetails.getUsername();
		User user = userService.getUserByUserEmail(userId);

		String nick = new String();
		String nickname = modifyInfo.getModifyNickname();
		if(nickname==null) {
			return new ResponseEntity<>(nick, HttpStatus.BAD_REQUEST);
		}
		user.setUserNickname(modifyInfo.getModifyNickname());
		userService.modifyUser(user);

//		if(modifyInfo.getModifyPw() != null) {
//			user.setUserPw(passwordEncoder.encode(modifyInfo.getModifyPw()));
//		}
		User us = userService.modifyUser(user);
		return new ResponseEntity<String>(nick, HttpStatus.OK);
	}


	@GetMapping("users")
	@ApiOperation(value = "전체 회원 조회", notes = "전체 회원을 조회한다")
	@ApiResponses({
			@ApiResponse(code = 200, message = "성공"),
			@ApiResponse(code = 401, message = "인증 실패"),
			@ApiResponse(code = 404, message = "사용자 없음"),
			@ApiResponse(code = 500, message = "서버 오류")
	})
	public ResponseEntity<List<User>> getAllUser(){
		return new ResponseEntity<>(userService.searchAllUser(), HttpStatus.OK);
	}

	@DeleteMapping("")
	@ApiOperation(value = "회원 탈퇴", notes = "회원을 탈퇴한다.")
	@ApiResponses({
			@ApiResponse(code = 200, message = "성공"),
			@ApiResponse(code = 401, message = "인증 실패"),
			@ApiResponse(code = 404, message = "사용자 없음"),
			@ApiResponse(code = 500, message = "서버 오류")
	})
	public ResponseEntity<?> delete (@RequestParam Integer userId) {
		userService.deleteUser(userId);
		return ResponseEntity.status(200).body(BaseResponseBody.of(200, "Success"));
	}

	//쫒겨난 user 돈 채워주기
	@PutMapping("/charge")
	public ResponseEntity<?> rubyCharge (@RequestParam Integer userId) {
		userService.rubyCharge(userId);
		return ResponseEntity.status(200).body(BaseResponseBody.of(200, "Success"));
	}


//	@PostMapping("/{userId}")
//	@ApiOperation(value = "회원 탈퇴", notes = "회원 정보는 저장하되 userIsActive=0 으로 변환한다.")
//	@ApiResponses({
//			@ApiResponse(code = 200, message = "성공"),
//			@ApiResponse(code = 401, message = "인증 실패"),
//			@ApiResponse(code = 404, message = "사용자 없음"),
//			@ApiResponse(code = 500, message = "서버 오류")
//	})
//	public ResponseEntity<?> removeUser( @RequestBody UserActiveReq userActiveReq,
//										 @ApiIgnore Authentication authentication){
//		SsafyUserDetails userDetails = (SsafyUserDetails) authentication.getDetails();
//		String userId = userDetails.getUsername();
//		User user = userService.getUserByUserEmail(userId);
//
//		User us = userService.searchUser(user.getUserId());
////		us.setUserIsActive(userActiveReq.getUserId());
//		us.setUserIsActive(0);
//		userService.isUserActive(user);
//		return ResponseEntity.status(200).body("OK");
//	}

}
