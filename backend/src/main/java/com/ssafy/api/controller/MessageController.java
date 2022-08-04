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
	public void message(GameMessage message, SimpMessageHeaderAccessor headerAccessor) {
		log.info(message.getType());

		if (message.getType().equals(MessageType.ENTER)) {
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
			gameService.createGame(roomId, groundCard1, groundCard2);
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
			PlayerCardSetInGame playerCardSetInGame = new PlayerCardSetInGame();
			playerCardSetInGame.setCardSet(cardSet);
			playerCardSetInGame.setTurn(0);
			// 게임의 개인 카드뭉치를 서버에서 갖고있는다.
			int gameCnt = playerCardSetInGameRepository.getGameCnt();
			playerCardSetInGameRepository.addPlayerCardSet(gameCnt + 1, playerCardSetInGame);

			// 끝났고 이제 카드달라고 각 요청하라함.
			message.setMessage("");
			message.setType(MessageType.MAKECARDSET);
			template.convertAndSend("/sub/game/room" + roomId, message);
		}

		// 카드 달라는 요청 받기(user의 수 만큼)
		if (message.getType().equals(MessageType.GETMYCARD)) {
			log.info("개인 카드 만들어볼께");

			int roomId = message.getRoomId();
			int roomSize = roomSizeRepository.getRoomSize(roomId);
			String userInfo = headerAccessor.getUser().getName();

			int thisGameId = playerCardSetInGameRepository.getGameCnt();
			PlayerCardSetInGame playerCardSetInGame = playerCardSetInGameRepository.getCardSet(thisGameId);
			List<Integer> cardSet = playerCardSetInGame.getCardSet();
			String content = "";


			// 내것만 빼고 나머지를 받는다.
			int idx = 0;
			int myCard = -1;
			for (GamePlayer gp : gamePlayerRepository.getGamePlayer(message.getRoomId())) {
				// 내거면 패스~
				if (gp.getSessionId().equals(userInfo)) {
					myCard = cardSet.get(idx);
					idx++;
					continue;
				} else {
					content += (cardSet.get(idx) + " ");
					idx++;
				}

			}
			message.setMessage(content);

			// tb_game_info생성 후 게임id, 플레이어id, 개인카드 입력
			gameInfoService.createGameInfo(gameRepository.findByGameId(thisGameId), 1, myCard);
			message.setType(MessageType.GETMYCARD);
			
			//특정 유저한테 메시지 보내기
			log.info(userInfo);
			template.convertAndSendToUser(userInfo, "sub/game/room" + message.getRoomId(), message);
		}

		// 방장먼저 베팅하기
		if (message.getType().equals(MessageType.BETTING)) {
			
		}

		// 콜이 들어왔을 때
		if (message.getType().equals(MessageType.CALL)) {

		}

		// 다이가 들어왔을 때
		if (message.getType().equals(MessageType.DIE)) {

		}

		// 레이즈가 들어왔을 때
		if (message.getType().equals(MessageType.RAISE)) {

		}

		// 올인이 들어왔을 때
		if (message.getType().equals(MessageType.ALLIN)) {

		}
		
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

}
