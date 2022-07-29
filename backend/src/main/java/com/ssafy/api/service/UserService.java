package com.ssafy.api.service;

import com.ssafy.api.request.UserSignUpReq;
import com.ssafy.api.request.UserModifyReq;
import com.ssafy.db.entity.User;

/**
 *	유저 관련 비즈니스 로직 처리를 위한 서비스 인터페이스 정의.
 */
public interface UserService {
	User signUp(UserSignUpReq userRegisterInfo);
	User getUserByUserEmail(String userEmail);
	User modifyUser(UserModifyReq userModifyReq);
	User changeUserPw(User user);
	boolean isUserEmailDuplicate(String userEmail);
	boolean isUserNicknameDuplicate(String userNickname);


}
