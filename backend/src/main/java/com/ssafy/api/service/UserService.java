package com.ssafy.api.service;

import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.ssafy.api.request.UserSignUpReq;
import com.ssafy.db.entity.Board;
import com.ssafy.db.entity.Tier;
import com.ssafy.db.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.ssafy.db.entity.User;
import org.springframework.transaction.annotation.Transactional;

import java.io.*;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.HashMap;
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
	@Autowired
	TierRepository tierRepository;

	@Transactional // 회원가입
	public User signUp(UserSignUpReq userSignUpReq) {
		User user = new User();
		user.setUserEmail(userSignUpReq.getUserEmail());
		user.setUserPw(passwordEncoder.encode(userSignUpReq.getUserPw()));
		user.setUserNickname((userSignUpReq.getUserNickname()));
		user.setUserGender(userSignUpReq.getUserGender());
		System.out.println(user.getUserEmail()+ user.getUserNickname());
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

//	@Transaction	al
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

	@Transactional
	public User searchUserByNickname(String userNickname){
		return userRepository.findByUserNickname(userNickname);
	}

	@Transactional
	public String getKaKaoAccessToken(String code){
		String access_Token="";
//		String refresh_Token ="";
		String reqURL = "https://kauth.kakao.com/oauth/token";

		try{
			URL url = new URL(reqURL);
			HttpURLConnection conn = (HttpURLConnection) url.openConnection();

			//POST 요청을 위해 기본값이 false인 setDoOutput을 true로
			conn.setRequestMethod("POST");
			conn.setDoOutput(true);

			//POST 요청에 필요로 요구하는 파라미터 스트림을 통해 전송
			BufferedWriter bw = new BufferedWriter(new OutputStreamWriter(conn.getOutputStream()));
			StringBuilder sb = new StringBuilder();
			sb.append("grant_type=authorization_code");
			sb.append("&client_id=332d131cbd88829ce06cb917276c31e9"); // TODO REST_API_KEY 입력
			sb.append("&redirect_uri=http://localhost:3000/lobby/rooms"); // TODO 인가코드 받은 redirect_uri 입력
			sb.append("&code=" + code);
			bw.write(sb.toString());
			bw.flush();

			//결과 코드가 200이라면 성공
			int responseCode = conn.getResponseCode();
			System.out.println("responseCode : " + responseCode);
			//요청을 통해 얻은 JSON타입의 Response 메세지 읽어오기
			BufferedReader br = new BufferedReader(new InputStreamReader(conn.getInputStream()));
			String line = "";
			String result = "";

			while ((line = br.readLine()) != null) {
				result += line;
			}
			System.out.println("response body : " + result);

			//Gson 라이브러리에 포함된 클래스로 JSON파싱 객체 생성
			JsonParser parser = new JsonParser();
			JsonElement element = parser.parse(result);

			access_Token = element.getAsJsonObject().get("access_token").getAsString();
//			refresh_Token = element.getAsJsonObject().get("refresh_token").getAsString();

			System.out.println("access_token : " + access_Token);
//			System.out.println("refresh_token : " + refresh_Token);

			br.close();
			bw.close();
		}catch (IOException e) {
			e.printStackTrace();
		}

		return access_Token;
	}


	public HashMap<String, Object> getKakaoUser(String token) {
		HashMap<String, Object> userInfo = new HashMap<>();
		String reqURL = "https://kapi.kakao.com/v2/user/me";

		//access_token을 이용하여 사용자 정보 조회
		try {
			URL url = new URL(reqURL);
			HttpURLConnection conn = (HttpURLConnection) url.openConnection();

			conn.setRequestMethod("POST");
			conn.setDoOutput(true);
			conn.setRequestProperty("Authorization", "Bearer " + token); //전송할 header 작성, access_token전송

			//결과 코드가 200이라면 성공
			int responseCode = conn.getResponseCode();
			System.out.println("responseCode : " + responseCode);

			//요청을 통해 얻은 JSON타입의 Response 메세지 읽어오기
			BufferedReader br = new BufferedReader(new InputStreamReader(conn.getInputStream()));
			String line = "";
			String result = "";

			while ((line = br.readLine()) != null) {
				result += line;
			}
			System.out.println("response body : " + result);

			//Gson 라이브러리로 JSON파싱
			JsonParser parser = new JsonParser();
			JsonElement element = parser.parse(result);

			JsonObject properties = element.getAsJsonObject().get("properties").getAsJsonObject();
			JsonObject kakao_account = element.getAsJsonObject().get("kakao_account").getAsJsonObject();

			String nickname = properties.getAsJsonObject().get("nickname").getAsString();
			String email = kakao_account.getAsJsonObject().get("email").getAsString();

			userInfo.put("nickname", nickname);
			userInfo.put("email", email);

			br.close();

		} catch (IOException e) {
			e.printStackTrace();
		}

		return userInfo;
	}

	@Transactional
	public boolean checkNickname(String nickname){
		try {
			User user  = userRepositorySupport.findUserByUserNickname(nickname).get();
		} catch (Exception e){
			return false;
		}
		return true;
	}

	@Transactional
	public List<User> searchByLikeNickname(String userNickname) {
		return userRepository.findByUserNicknameContaining(userNickname);
	}
	@Transactional
	public boolean rubyCharge(Integer userId){
		try {
			User user  = userRepository.findByUserId(userId);
			user.setUserRuby(50);
			userRepository.save(user);
		} catch (Exception e){
			return false;
		}
		return true;
	}

	@Transactional
	public Tier getUserTier(Integer userId){
		//티어 판단하기
		User player = userRepository.findByUserId(userId);
		//3만 루비 넘으면 에메랄드
		if(player.getUserRuby()>=30000){
			player.setTier(tierRepository.findByTierId(4));
		}
		//1만 루비 넘으면 다이아몬드
		else if(player.getUserRuby()>=10000){
			player.setTier(tierRepository.findByTierId(3));
		}
		//1천루비 넘으면 아쿠아마린
		else if(player.getUserRuby()>=1000){
			player.setTier(tierRepository.findByTierId(2));
		}
		//아니면 다 자수정
		else{
			player.setTier(tierRepository.findByTierId(1));
		}
		Tier myTier = player.getTier();
		return myTier;
	}
}