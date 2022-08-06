package com.ssafy.api.controller;

import com.ssafy.db.entity.GameMessage;
import com.ssafy.db.entity.GamePlayer;
import com.ssafy.db.entity.PlayerCardSetInGame;
import com.ssafy.db.repository.GamePlayerRepository;
import com.ssafy.db.repository.GameRepository;
import com.ssafy.db.repository.PlayerCardSetInGameRepository;
import com.ssafy.db.repository.RoomSizeRepository;
import com.ssafy.db.vo.MessageType;
import com.ssafy.api.service.GameInfoService;
import com.ssafy.api.service.GameService;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.util.ArrayList;
import java.util.List;
import java.util.Random;

@Controller
@RequiredArgsConstructor
@Log4j2
/**
 * @MessageMapping을 통해 Websocket으로 들어오는 메시지 발행을 처리합니다. 클라이언트에서는 prefix를 붙여서
 *                  /pub/game/message로 발행 요청을 하면 Controller가 해당 메시지를 받아 처리합니다.
 *                  메시지가 발행되면 /sub/game/room/{roomId}로 메시지를 send 하는 것을 볼 수 있는데
 *                  클라이언트에서는 해당 주소를(/sub/game/room/{roomId}) 구독(subscribe)하고 있다가
 *                  메시지가 전달되면 화면에 출력하면 됩니다. 여기서 /sub/game/room/{roomId}는 채팅룸을
 *                  구분하는 값이므로 pub/sub에서 Topic의 역할이라고 보면 됩니다.
 */
//기존의 WebSocketHandler가 했던 역할을 대체한다!!
public class MessageController {

	// 메세지를 보내는 양식을 지정해둔 template
	// 이걸 사용하면 편하게 메세지를 클라이언트쪽으로 보낼 수 있음.
	@Autowired
	private final SimpMessagingTemplate template;
	@Autowired
	private GameService gameService;
	@Autowired
	private GameInfoService gameInfoService;
	@Autowired
	private RoomSizeRepository roomSizeRepository;
	@Autowired
	private PlayerCardSetInGameRepository playerCardSetInGameRepository;
	@Autowired
	private GameRepository gameRepository;
	@Autowired
	private GamePlayerRepository gamePlayerRepository;

	// 클라이언트에서 메세지가 날라왔다.
	@MessageMapping(value = "/game/message")
	// headerAccessor는 소켓서버의 주인ID를 확인하기 위해서 사용
	public void message(GameMessage message, SimpMessageHeaderAccessor headerAccessor) throws InterruptedException {
		log.info(message.getType());

		if (message.getType().equals(MessageType.ENTER)) {
			log.info(headerAccessor.getUser().getName());
			// 방에 들어오면 player를 한명 올려준다.
			roomSizeRepository.plusPlayerCnt(message.getRoomId());

			// gamePlayer에 넣어준다.
			gamePlayerRepository.addGamePlayer(message.getRoomId(), headerAccessor.getUser().getName());

			message.setMessage("새로운 플레이어가 게임에 입장하셨습니다. / name : " + headerAccessor.getUser().getName());
			template.convertAndSend("/sub/game/room" + message.getRoomId(), message);
		}

		// 게임이 시작버튼이 눌렸다.
		if (message.getType().equals(MessageType.START)) {
			// 게임이 시작되었습니다. 메시지 주기
			message.setMessage("게임이 시작되었습니다.");
			template.convertAndSend("/sub/game/room" + message.getRoomId(), message);

			// 공용카드 뽑기
			int roomId = message.getRoomId();
			Random r = new Random();
			int groundCard1 = r.nextInt(39);
			int groundCard2 = r.nextInt(39);
			while (groundCard1 == groundCard2) {
				groundCard2 = r.nextInt(39);
			}

			// tb_game 생성 -> 공용카드 넣기
			int gameId = gameService.createGame(roomId, groundCard1, groundCard2);
			log.info(gameId);
			message.setGameId(gameId);

			message.setMessage("공통카드 : " + groundCard1 + ", " + groundCard2);
			message.setType(MessageType.GROUNDCARD);
			template.convertAndSend("/sub/game/room" + roomId, message);

			// 사람들한테 bettingUnit만큼 돈 내게하기
			message.setMessage("기본 베팅금액을 베팅하십시오.");
			message.setType(MessageType.UNITBETTING);
			template.convertAndSend("/sub/game/room" + roomId, message);

			// 카드뭉치에 개인 카드 넣기
			// 방인원 수 구하기
			int roomSize = roomSizeRepository.getRoomSize(roomId);
			// 그 인원만큼 카드 만들어서 뭉치에 넣기
			List<Integer> cardSet = new ArrayList<>();
			for (int i = 0; i < roomSize; i++) {
				while (true) {
					// 39장 중 랜덤으로 한장 뽑는다.
					int playerCard = r.nextInt(39);
					// 새로운 카드면 카드뭉치에 넣고 다음사람 카드 뽑는다.
					if (playerCard != groundCard1 && playerCard != groundCard2 && !cardSet.contains(playerCard)) {
						cardSet.add(playerCard);
						break;
					}
				}
			} // 카드뽑기 for문 종료
			PlayerCardSetInGame thisGameCardSet = new PlayerCardSetInGame();
			thisGameCardSet.setCardSet(cardSet);

			// 게임의 개인 카드뭉치를 서버에서 갖고있는다.
			playerCardSetInGameRepository.addPlayerCardSet(gameId, thisGameCardSet);

//			// 끝났고 이제 카드달라고 각 요청하라함.
//			message.setMessage("");
//			message.setType(MessageType.MAKECARDSET);
//			template.convertAndSend("/sub/game/room" + roomId, message);

			//이 방에서 게임하고있는 플레이어들
			List<GamePlayer> thisGamePlayer = gamePlayerRepository.getGamePlayer(message.getRoomId());

			//이 방에있는 플레이어들한테 각자 메시지 보내주자
			int idx = 0;
			for(GamePlayer gp : thisGamePlayer){
				log.info(idx);
				String content ="";
				//카드뭉치에서 자기것만 빼고 보내준다.
				int myCard = cardSet.get(idx);
				for(int i=0; i< thisGamePlayer.size(); i++){
					if(idx==i)
						continue;
					content+=cardSet.get(i)+" ";
				}
				idx++;

				message.setMessage(content);
				message.setType(MessageType.GETMYCARD);

				// tb_game_info생성 후 게임id, 플레이어id, 개인카드 입력
				gameInfoService.createGameInfo(gameId, 1, myCard);

				template.convertAndSendToUser(gp.getSessionId(), "sub/game/room" + message.getRoomId(), message);
			}

			// 10초 기다리기(자유롭게 대화)
			Thread.sleep(10000);
			log.info("10초끝");

			// Turn부터 시작하기
			// 마이턴 찾아서 너 해!!
			for (GamePlayer pg : thisGamePlayer) {
				// 얘가 첨이다
				if (pg.isMyTurn()) {
					String firstUserId = pg.getSessionId();
					message.setMessage("당신의 차례입니다. 배팅을 하세요");
					message.setType(MessageType.FIRSTBETTING);
					template.convertAndSendToUser(firstUserId, "sub/game/room" + message.getRoomId(), message);
				}
			}
		}

		//********************배팅관련 처리********************
		// 콜이 들어왔을 때
		if (message.getType().equals(MessageType.CALL)) {
			int roomId =  message.getRoomId();
			int gameId = message.getGameId();
			// call한 사람 sessionId
			String userInfo = headerAccessor.getUser().getName();
			String userNickname = message.getSenderNickName();

			// 이 사람이 콜 누른걸 알려줘야댐.
			message.setMessage(userInfo+"플레이어가 콜을 하셨습니다.");
			message.setType(MessageType.PLAYERCALL);
			template.convertAndSend("/sub/game/room" + roomId, message);

			// GamePlayer에서 myBetting plus 해주고 callBettingCnt 돌려주기
			int callBettingCnt = gamePlayerRepository.callBetting(roomId, userInfo);

			// GameInfo에서 rubyGet minus해주기
			gameInfoService.callBetting(gameId, userNickname, callBettingCnt);


			// 끝났는지체크


			// 다음턴으로 넘기고 그사람한테 배팅하라고 알려줌
		}

		// 다이가 들어왔을 때
		if (message.getType().equals(MessageType.DIE)) {

		}

		// 레이즈가 들어왔을 때
		if (message.getType().equals(MessageType.RAISE)) {
			int roomId =  message.getRoomId();

			// raise한 사람 sessionId
			String userInfo = headerAccessor.getUser().getName();
			int gameId = message.getGameId();

			// 이 사람이 레이즈 누른걸 알려줘야댐.
			message.setMessage(userInfo+"플레이어가 레이즈를 하셨습니다.");
			message.setType(MessageType.PLAYERRAISE);
			template.convertAndSend("/sub/game/room" + roomId, message);

			//얼마나 raise?
			int raiseCnt = Integer.parseInt(message.getMessage());

			// GamePlayer에서 myBetting plus 해주고 raiseBettingCnt 돌려주기
			int raiseBetting = gamePlayerRepository.raiseBetting(roomId, userInfo, raiseCnt);

			// GameInfo에서 rubyGet minus해주기
			gameInfoService.raiseBetting(gameId, userInfo, raiseBetting);


			// 끝났는지체크


			// 다음턴으로 넘기고 그사람한테 배팅하라고 알려줌
		}

		// 올인이 들어왔을 때
		if (message.getType().equals(MessageType.ALLIN)) {

		}
		//***************************************************



		//********************나갔을때 확인********************
		// 나갔을때
		if (message.getType().equals(MessageType.EXIT)) {
			// 방에 나가면 player를 한명 내려준다.
			roomSizeRepository.minusPlayerCnt(message.getRoomId());

			// gamePlayer에서 빼준다.
			//지운애가 방장이면 true 반환한다.
			boolean flag = gamePlayerRepository.deleteGamePlayer(message.getRoomId(), headerAccessor.getUser().getName());
			//방장 지웠으면 그 다음애 true
			if(flag) {
				gamePlayerRepository.getGamePlayer(message.getRoomId()).get(0).setMyTurn(true);
			}

			message.setMessage("새로운 플레이어가 게임에 입장하셨습니다. / name : " + headerAccessor.getUser().getName());
			template.convertAndSend("/sub/game/room" + message.getRoomId(), message);
		}

	}


	//다음 사람을 비교해서 게임 종료 여부와 다음 차례인 사람을 찾는 함수
	public void nextTurn(GameMessage message, SimpMessageHeaderAccessor headerAccessor) {
		//게임방에 참여중인 참가자들을 구한다
		List<GamePlayer> gp = gamePlayerRepository.getGamePlayer(message.getRoomId());
		GamePlayer me = null;
		int i = 0;
		for(; i < gp.size(); i++){ //내가 누군지 찾는다
			if(gp.get(i).getSessionId().equals(headerAccessor.getUser().getName())){
				me = gp.get(i);
				break;
			}
		}

		//앞 사람과 비교해서 max베팅이 같으면 모두가 콜을 한 것이니 게임 종료!
		if(me.getMaxBetting() == gp.get((i+1)%gp.size()).getMaxBetting()){
			//타입을 게임 끝으로 바꿔주고 방 안에 있는 모든 사용자에게 알려줌
			message.setType(MessageType.GAMEEND);
			message.setMessage("게임이 끝났습니다.");
			template.convertAndSend("/sub/game/room" + message.getRoomId(), message);
			return;
		}

		//위에서 리턴이 안되고 내려오면 게임이 안 끝나고 다음 사람이 배팅을 해야함.
		gp.get((i+1)%gp.size()).setMaxBetting(me.getMaxBetting()); // 다음 사람의 maxbetting을 내 맥스베팅금액으로 업데이트해준다.
		gp.get(i).setMyTurn(false); //내 턴 끝
		gp.get((i+1)%gp.size()).setMyTurn(true); //다음사람 턴 시작
		message.setType(MessageType.BETTING);
		message.setMessage("내 차례입니다.");
		//베팅할 차례를 해당 유저에게만 알려준다.
		template.convertAndSendToUser(gp.get((i+1)%gp.size()).getSessionId(), "/sub/game/room" + message.getRoomId(), message);

	}

}
