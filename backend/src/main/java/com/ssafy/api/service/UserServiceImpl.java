package com.ssafy.api.service;

import com.ssafy.api.request.UserSignUpReq;
import com.ssafy.api.request.UserModifyReq;
import com.ssafy.db.repository.UserRepositorySupport;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.ssafy.db.entity.User;
import com.ssafy.db.repository.UserRepository;

/**
 *	유저 관련 비즈니스 로직 처리를 위한 서비스 인터페이스 정의.
 */
@Service("userService")
public class UserServiceImpl implements UserService {
	@Autowired
	UserRepository userRepository;
	@Autowired
	UserRepositorySupport userRepositorySupport;
	@Autowired
	PasswordEncoder passwordEncoder;

	@Override
	public User signUp(UserSignUpReq userSignUpReq) {
		User user = new User();
		user.setUserEmail(userSignUpReq.getUserEmail());
		user.setUserPw(passwordEncoder.encode(userSignUpReq.getUserPw()));
		user.setUserNickname((userSignUpReq.getUserNickname()));
		user.setUserGender(userSignUpReq.getUserGender());
		return userRepository.save(user);
	}

	@Override
	// 유저 정보 조회
	public User getUserByUserEmail(String userEmail) {
		try {
			User user = userRepositorySupport.findUserByUserEmail(userEmail).get();
			System.out.println("user : " + user.getUserPw());
			return user;
		}catch (Exception e){
			return User.builder().userEmail("DDD@dDD").userPw("string").userGender("F").userNickname("ssafy123").build();
		}
	}

	@Override
	public User modifyUser(User user) {
//		User user = new User();
//		user.setUserEmail(userModifyReq.getModifyEmail());
		user.setUserPw(passwordEncoder.encode(user.getUserPw()));
//		user.setUserNickname((userModifyReq.getModifyNickname()));
//		user.setUserGender(userModifyReq.getModifyGender());
		return userRepository.save(user);
	};

	@Override
	public User changeUserPw(User user) {
		user.setUserPw(passwordEncoder.encode(user.getUserPw()));
		return userRepository.save(user);
	}

	@Override
	public boolean isUserEmailDuplicate(String userEmail) {
		try {
			User user = userRepositorySupport.findUserByUserEmail(userEmail).get();
		} catch (Exception e) {
			return false;
		}
		return true;
	}

	@Override
	public boolean isUserNicknameDuplicate(String userNickname) {
		try {
			User user = userRepositorySupport.findUserByUserNickname(userNickname).get();
		} catch (Exception e) {
			return false;
		}
		return true;
	}


}