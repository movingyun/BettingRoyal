package com.ssafy.api.service;

import com.ssafy.api.request.UserSignUpReq;
import com.ssafy.db.entity.Board;
import com.ssafy.db.repository.BoardRepository;
import com.ssafy.db.repository.ReplyRepository;
import com.ssafy.db.repository.UserRepositorySupport;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.ssafy.db.entity.User;
import com.ssafy.db.repository.UserRepository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 *	유저 관련 비즈니스 로직 처리를 위한 서비스 인터페이스 정의.
 */
@Service("userService")
public class UserService {
	@Autowired
	UserRepository userRepository;
	@Autowired
	UserRepositorySupport userRepositorySupport;
	@Autowired
	PasswordEncoder passwordEncoder;

	@Transactional // 회원가입
	public User signUp(UserSignUpReq userSignUpReq) {
		User user = new User();
		user.setUserEmail(userSignUpReq.getUserEmail());
		user.setUserPw(passwordEncoder.encode(userSignUpReq.getUserPw()));
		user.setUserNickname((userSignUpReq.getUserNickname()));
		user.setUserGender(userSignUpReq.getUserGender());
		return userRepository.save(user);
	}

	@Transactional // 유저 정보조회
	public User getUserByUserEmail(String userEmail) {
		try {
			User user = userRepositorySupport.findUserByUserEmail(userEmail).get();
			System.out.println("user : " + user.getUserPw());
			return user;
		}catch (Exception e){
			return User.builder().userEmail("DDD@dDD").userPw("string").userGender("F").userNickname("ssafy123").build();
		}
	}

	@Transactional
	public User modifyUser(User user) {
		return userRepository.save(user);
	};

	@Transactional
	public User changeUserPw(User user) {
		user.setUserPw(passwordEncoder.encode(user.getUserPw()));
		return userRepository.save(user);
	}

	@Transactional
	public boolean isUserEmailDuplicate(String userEmail) {
		try {
			User user = userRepositorySupport.findUserByUserEmail(userEmail).get();
		} catch (Exception e) {
			return false;
		}
		return true;
	}

	@Transactional
	public boolean isUserNicknameDuplicate(String userNickname) {
		try {
			User user = userRepositorySupport.findUserByUserNickname(userNickname).get();
		} catch (Exception e) {
			return false;
		}
		return true;
	}

	@Transactional
	public List<User> searchAllUser() {
		return userRepository.findAll();
	}

	@Transactional
	public User searchUser(Integer userId) {
		return userRepository.findByUserId(userId);
	}

//	@Transactional
//	public void deleteUser(Integer userId) {
//		userRepository.deleteByUserId(userId);
//	}

	@Autowired
	BoardRepository boardRepository;
	@Autowired
	ReplyRepository replyRepository;

	@Transactional
	public void deleteUser(Integer userId) {
//		User user = userRepository.findByUserId(userId);
//
//		// 탈퇴한 회원이 작성한 게시물이 있을 때
//		if(boardRepository.existsByUser(user.getUserId())) {
//			List<Board> board = boardRepository.findByUserId(user.getUserId());
//			for(int i=0; i<board.size(); i++) {
//				// 게시물에 댓글이 있을 때 댓글 모두 삭제
//				if(replyRepository.existsByBoard(board.get(i))){
//					replyRepository.deleteByBoard(board.get(i));
//				}
//				boardRepository.deleteBoardByBoardIdAndUserId(board.get(i).getBoardId());
//			}
//		}
		userRepository.deleteByUserId(userId);
	}

	@Transactional
	public List<User> findMyFriends(List<Integer> userIdList){
		return userRepository.findByUserIdIn(userIdList);
	}

}