package com.ssafy.api.controller;

import com.ssafy.api.service.*;
import com.ssafy.db.entity.*;
import com.ssafy.db.repository.GamePlayerRepository;
import com.ssafy.db.repository.GameRepository;
import com.ssafy.db.repository.PlayerCardSetInGameRepository;
import com.ssafy.db.repository.RoomSizeRepository;
import com.ssafy.db.entity.GameMessage;
import com.ssafy.db.entity.GamePlayer;
import com.ssafy.db.entity.PlayerCardSetInGame;
import com.ssafy.db.entity.User;
import com.ssafy.db.repository.*;
import com.ssafy.db.vo.MessageType;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

import java.util.ArrayList;
import java.util.Arrays;
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
	@Autowired
	private RoomService roomService;
	@Autowired
	private UserRepository userRepository;
	@Autowired
	private UserService userService;
	@Autowired
	private MissionRepository missionRepository;
	@Autowired
	private BettingService bettingService;
	@Autowired
	private RoomRepository roomRepository;

	// 클라이언트에서 메세지가 날라왔다.
	@MessageMapping(value = "/game/message")
	// headerAccessor는 소켓서버의 주인ID를 확인하기 위해서 사용
	public void message(GameMessage message, SimpMessageHeaderAccessor headerAccessor) throws InterruptedException {
		log.info(message.getType());
		//이 방에서 게임하고있는 플레이어들
		List<GamePlayer> gpList = gamePlayerRepository.getGamePlayer(message.getRoomId());

		if (message.getType().equals(MessageType.ENTER)) {

			int roomId = message.getRoomId();
			Room currentRoom = roomRepository.findByRoomId(roomId);
			if(currentRoom.isRoomIsClose()|| currentRoom.isRoomIsStart()||currentRoom.getRoomInCnt()==6)
				return;

			log.info(headerAccessor.getUser().getName());
			// 방에 들어오면 player를 한명 올려준다.
			roomSizeRepository.plusPlayerCnt(roomId);

			//todo : room에 현재인원 추가 해결
			roomService.addRoomInCnt(roomId);

			// gamePlayer에 넣어준다.
			gamePlayerRepository.addGamePlayer(message, headerAccessor.getUser().getName());

			gpList = gamePlayerRepository.getGamePlayer(roomId);

			//게임 진행에 필요한 정보들은 모두 서버에 저장되었으니 클라이언트에게 뿌려줄 정보를 다듬는다.
			List<PlayerInfo> piList = new ArrayList<>();
			//안에 정보들을 채워준다!
			for(GamePlayer gp : gpList){
				PlayerInfo info = new PlayerInfo();
				info.setNickname(gp.getUser().getUserNickname());
				info.setMyruby(gp.getUser().getUserRuby());
				info.setSessionId(gp.getSessionId());
				piList.add(info);
			}

			//player들어올때마다 모든 플레이어한테 모든 플레이어 정보 보내주기

			//gp에 myTurn이 true인 아이로 turnIdx설정
			//turnIdx 자기 기준으로 다시 보내주기위해서 gp기준 firstIdx찾기
			int firstIdx = 0;
			for(GamePlayer gp : gpList){
				if(gp.isMyTurn()){
					break;
				}
				firstIdx++;
			}

			//이 방에있는 플레이어들한테 각자 메시지 보내주자
			int idx = 0;
			for(GamePlayer gp : gpList){
				message.setType(MessageType.ENTER);

				//나를 기준으로 0번부터 보내주기.
				List<PlayerInfo> piList2 = new ArrayList<>();
				for(int i = idx; i-idx< piList.size(); i++){
					piList2.add(piList.get(i%piList.size()));
				}

				//메시지에 PlayerInfo를 담는다.
				message.setPlayerInfo(piList2);

				//turnIdx를 사람마다 각각 넣어주기
				int turnIdx = firstIdx-idx;
				if(turnIdx<0)
					turnIdx+=gpList.size();
				message.setTurnIdx(turnIdx%piList.size());

				//기본 데이터들 서버 데이터로 바꿔주기
				message.setRoomId(gp.getRoomId());
				message.setBattingUnit(gp.getBattingUnit());
				message.setMessage("새로운 플레이어가 게임에 입장하셨습니다. / name : " + headerAccessor.getUser().getName());
				log.info(message.getPlayerInfo().get(0).getMyruby());
				template.convertAndSendToUser(gp.getSessionId(), "sub/game/room" + gp.getRoomId(), message);

				idx++;
			}
		}

		// 게임이 시작버튼이 눌렸다.
		if (message.getType().equals(MessageType.START)) {
			int roomId = message.getRoomId();

			// 시작한 사람 sessionId
			String userInfo = message.getSocketId();
//			String userInfo = headerAccessor.getUser().getName();
			//이거 요청이 맞는 순서인 유저한테 들어온건지 확인
			//sessiond로 GamePlayer를 찾아서 걔의 턴이 아니면 그냥 return
			boolean isMyTurn = bettingService.checkBettingTurn(gpList, userInfo);
			if(!isMyTurn){
				log.info("너 차례 아니다.");
				return;
			}

			// 게임이 시작되었습니다. 메시지 주기
			message.setMessage("게임이 시작되었습니다.");
			template.convertAndSend("/sub/game/room" + message.getRoomId(), message);

			//tb_room roomIsStart true로 바꿔주기.
			roomService.startByRoomId(roomId);

			// 공용카드 뽑기
			Random r = new Random();
			int groundCard1 = r.nextInt(39);
			int groundCard2 = r.nextInt(39);
			while (groundCard1 == groundCard2) {
				groundCard2 = r.nextInt(39);
			}

			// tb_game 생성 -> 공용카드 넣기
			//미션도 찾아와서 게임에 같이 넣어줌
//			int missionId = r.nextInt(missionRepository.getMissionCnt())+1;
			int missionId = 1;

			Mission mission = missionRepository.findByMissionId(missionId);
			int gameId = gameService.createGame(roomId, groundCard1, groundCard2, mission);
			log.info(gameId);
			message.setGameId(gameId);
			//메세지에 미션도 추가해줌!
			message.setMission(mission.getMission());

			message.setMessage("공통카드 : " + groundCard1 + ", " + groundCard2);
			message.setType(MessageType.GROUNDCARD);
			template.convertAndSend("/sub/game/room" + roomId, message);

			//방 정보 가져와서 기본 배팅 금액 가져오기
			Room room = roomService.getRoom(roomId);
			int bettingUnit = room.getRoomBettingUnit();



			// 사람들한테 bettingUnit만큼 돈 내게하기
			message.setMessage("기본 베팅금액을 베팅하십시오.");
			message.setType(MessageType.UNITBETTING);
			//기본 베팅한 것 판돈 올려주기
			message.setGameTotalBet(message.getGameTotalBet()+ (bettingUnit*gpList.size()));
			template.convertAndSend("/sub/game/room" + roomId, message);


			// 게임 방 안의 모든 유저 돈 내고 게임 한 판 추가
			for(GamePlayer gp : gpList){
				//디비에 유저에서도 업데이트 해줌
				User temp = gp.getUser();
				temp.setUserRuby(temp.getUserRuby()-bettingUnit);
				temp.setUserGameCount(temp.getUserGameCount()+1);
				userService.modifyUser(temp);
				//게임 유저들 게임 배팅 정보 업데이트
				gp.setMaxBetting(gp.getMaxBetting()+bettingUnit);
				gp.setMyBetting(gp.getMyBetting()+bettingUnit);
				//todo : gameTotalBet 구하는 방식 변경 : 사람 나갔을 때 고려(GP에 totalBet만들기) 해결
				//유저들에 저장된 게임 총 배팅도 업데이트
				gp.setGameTotalBet(message.getGameTotalBet());
			}

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
						//서버에 저장하는 방 인원 정보에도 카드 넣어주기
						gpList.get(i).setMyCard(playerCard);
						//공통 카드도 넣어주기
						gpList.get(i).setGroundCard1(groundCard1);
						gpList.get(i).setGroundCard2(groundCard2);
						break;
					}
				}
			} // 카드뽑기 for문 종료

			//족보 넣어주기
			getRank(gpList);

			PlayerCardSetInGame thisGameCardSet = new PlayerCardSetInGame();
			thisGameCardSet.setCardSet(cardSet);

			// 게임의 개인 카드뭉치를 서버에서 갖고있는다.
			playerCardSetInGameRepository.addPlayerCardSet(gameId, thisGameCardSet);

			//게임 진행에 필요한 정보들은 모두 서버에 저장되었으니 클라이언트에게 뿌려줄 정보를 다듬는다.
			List<PlayerInfo> piList =getClientPlayerInfoMsg(gpList, message) ;

			//gp에 myTurn이 true인 아이로 turnIdx설정
			//turnIdx 자기 기준으로 다시 보내주기위해서 gp기준 firstIdx찾기
			int firstIdx = 0;
			for(GamePlayer gp : gpList){
				if(gp.isMyTurn()){
					break;
				}
				firstIdx++;
			}

			//이 방에있는 플레이어들한테 각자 메시지 보내주자
			int idx = 0;
			for(GamePlayer gp : gpList){
				//서버에서 저장하는 이 방에서 게임하는 플레이어들의 게임 아이디를 저장해주자
				gp.setGameId(gameId);
				//서버에서 저장하는 이 방에서 게임하는 플레이어들에게 방의 기본 베팅도 저장해주자
				gp.setBattingUnit(bettingUnit);

				//카드뭉치에서 자기것만 빼고 보내준다.
				int myCard = cardSet.get(idx);

				message.setType(MessageType.GETMYCARD);
				message.setMessage("카드를 받았습니다. 첫번째 사람부터 베팅을 시작합니다.");
				//기본베팅한거 반영
				message.setGameMaxBet(message.getGameMaxBet()+bettingUnit);

				// tb_game_info생성 후 게임id, 플레이어, 개인카드 입력
				gameInfoService.createGameInfo(gameId, gp.getUser(), myCard);

				// 기본베팅한거 DB넣어주기!!
				gameInfoService.unitBetting(gameId,gp.getUser().getUserId(),bettingUnit);

				//나를 기준으로 0번부터 보내주기.
				List<PlayerInfo> piList2 = new ArrayList<>();
				for(int i = idx; i-idx< piList.size(); i++){
					piList2.add(piList.get(i%piList.size()));
				}

				//turnIdx를 사람마다 각각 넣어주기
				int turnIdx = firstIdx-idx;
				if(turnIdx<0)
					turnIdx+=gpList.size();
				message.setTurnIdx(turnIdx%piList.size());

				//메시지에 PlayerInfo를 담는다.
				message.setPlayerInfo(piList2);

				//클라이언트에 보내주는 메세지 중 playerInfo에 내 정보에서 내카드, 내 족보는 알려주지 말자!!(카드:40으로 / 족보는 null로)
				String myPair = message.getPlayerInfo().get(0).getMyPair();
				message.getPlayerInfo().get(0).setMyCard(40);
				message.getPlayerInfo().get(0).setMyPair(null);

				//기본 데이터들 서버 데이터로 바꿔주기
				settingBasicGameMessage(gp, message);
				template.convertAndSendToUser(gp.getSessionId(), "sub/game/room" + gp.getRoomId(), message);

//				//위에서 바꾼 내 카드 정보를 다시 원래대로 돌린다.
				message.getPlayerInfo().get(0).setMyCard(gp.getMyCard());
				message.getPlayerInfo().get(0).setMyPair(myPair);

				idx++;
			}

//			// 10초 기다리기(자유롭게 대화)
//			Thread.sleep(10000);
//			log.info("10초끝");

		}

		//********************배팅관련 처리********************
		// 콜이 들어왔을 때
		if (message.getType().equals(MessageType.CALL)) {
			// call한 사람 sessionId
			String userInfo = message.getSocketId();
//			String userInfo = headerAccessor.getUser().getName();
			int roomId =  message.getRoomId();
			//이거 요청이 맞는 순서인 유저한테 들어온건지 확인
			//sessiond로 GamePlayer를 찾아서 걔의 턴이 아니면 그냥 return
			boolean isMyTurn = bettingService.checkBettingTurn(gpList, userInfo);
			if(!isMyTurn){
				log.info("너 차례 아니다.");
				return;
			}
			//첫 사람은 call 못한다.
			boolean isFirstBetting = bettingService.checkFirstBetting(gpList,userInfo);
			if(isFirstBetting){
				log.info("첫 사람은 콜을 할 수 없습니다.");
				return;
			}
			// call 시작
			bettingService.call(roomId, userInfo, message);
			// 끝났는지체크
			checkFinish(message, headerAccessor);
		}

		// 다이가 들어왔을 때
		if (message.getType().equals(MessageType.DIE)) {
			int roomId =  message.getRoomId();
			String userInfo = message.getSocketId();
//			String userInfo = headerAccessor.getUser().getName();

			//sessiond로 GamePlayer를 찾아서 걔의 턴이 아니면 그냥 return
			for(GamePlayer gp : gpList){
				if(gp.getSessionId().equals(userInfo)){
					if(!gp.isMyTurn()){
						log.info("너 차례 아니야");
						return;
					}
				}
			}

			gamePlayerRepository.dieBetting(roomId, userInfo);

			// 끝났는지체크
			checkFinish(message, headerAccessor);
		}

		// 레이즈가 들어왔을 때
		if (message.getType().equals(MessageType.RAISE)) {
			//roomId와 sessiond로 GamePlayer를 찾아서 걔의 myTurn이 true인지 확인
			int roomId =  message.getRoomId();
			String userInfo = message.getSocketId();
//			String userInfo = headerAccessor.getUser().getName();

			//이거 요청이 맞는 순서인 유저한테 들어온건지 확인
			//sessiond로 GamePlayer를 찾아서 걔의 턴이 아니면 그냥 return
			boolean flag = bettingService.checkBettingTurn(gpList, userInfo);
			if(!flag){
				log.info("너 차례 아니다.");
				return;
			}

			//자기돈 보다 많이 raise했으면 돌려보네
			if(!bettingService.raise(roomId, userInfo, message)){
				log.info("너 가진돈보다 너무 많이 레이즈 했어");
				return;
			}

			// 끝났는지체크
			checkFinish(message, headerAccessor);
		}

		// 올인이 들어왔을 때
		if (message.getType().equals(MessageType.ALLIN)) {
			//roomId와 sessiond로 GamePlayer를 찾아서 걔의 myTurn이 true인지 확인
			int roomId =  message.getRoomId();
			String userInfo = message.getSocketId();
//			String userInfo = headerAccessor.getUser().getName();

			//이거 요청이 맞는 순서인 유저한테 들어온건지 확인
			//sessiond로 GamePlayer를 찾아서 걔의 턴이 아니면 그냥 return
			boolean flag = bettingService.checkBettingTurn(gpList, userInfo);
			if(!flag){
				log.info("너 차례 아니다.");
				return;
			}

			bettingService.allIn(roomId, userInfo, message);

			// 끝났는지체크
			checkFinish(message, headerAccessor);
		}

		// 나가기 들어왔을 때
		if (message.getType().equals(MessageType.EXIT)) {
			int roomId =  message.getRoomId();
//			String userInfo = message.getSocketId();
			String userInfo = headerAccessor.getUser().getName();

			//이 소켓아이디 끊어주자.
			//여기 해주자
			onDisconnectEvent(userInfo);
		}
	}

	//다음 사람을 비교해서 게임 종료 여부와 다음 차례인 사람을 찾는 함수
	public void checkFinish(GameMessage message, SimpMessageHeaderAccessor headerAccessor) {
		//게임방에 참여중인 참가자들을 구한다
		int roomId = message.getRoomId();
		List<GamePlayer> gpList = gamePlayerRepository.getGamePlayer(roomId);

		//finishCnt와 dieCnt를 활용해서 게임이 끝났는지 확인
		//finishCnt = dieCnt + (userBetting==MaxBetting)Cnt
		int finishCnt = 0;
		int dieCnt = 0;
		int winnerRuby = 0;
		for(GamePlayer gp : gpList){
			winnerRuby+=gp.getMyBetting();
			//플레이어의 베팅이 기본베팅이 아니면서 (maxBetting이랑 같으면 or 올인에 콜(내 돈이 0원) 했으면) finishCnt올려준다.
			if(gp.getMyBetting()!=gp.getBattingUnit()&&(gp.getMyBetting()==gp.getMaxBetting()||gp.getUser().getUserRuby()==0)){
				finishCnt++;
				continue;
			}
			else if(gp.isDie()){
				finishCnt++;
				dieCnt++;
				continue;
			}
//			//하나라도 충족못하면 다음턴 진행해야된다.
//			break;
		}

		//finishCnt가 gameSize거나
		//dieCnt가 gameSize-1이면 게임을 끝낸다.
		int gameSize = gpList.size();
		//******************************게임 끝남!!!!******************************
		if(finishCnt==gameSize||dieCnt==gameSize-1){
			log.info("게임 끝났다.");

			// 누가 이겼는지 확인해보자.
			int winnerIdx = getWinner(gpList);


			//이긴사람 루비 플러스해주기
			User winner = gpList.get(winnerIdx).getUser();
			winner.setUserRuby(winner.getUserRuby()+winnerRuby);
			winner.setUserWin(winner.getUserWin()+1);

			// tb_gameInfo에 이긴사람은 루비획득+해주고 승리여부 이긴거 기록해줘야함.
			int gameId = gpList.get(winnerIdx).getGameId();
			int winnerId = winner.getUserId();
			String winnerNickname = winner.getUserNickname();
			gameInfoService.winnerGetRubyAndWriteWin(gameId, winnerId, winnerRuby);

			// tb_game에 승자 기록
			Game game = gameRepository.findByGameId(gameId);
			game.setGameWinner(winnerId);
			gameService.modifyGame(game);

			// tb_user의 승수,루비 수 올려주기
			User user = userRepository.findByUserNickname(winnerNickname);
			user.setUserRuby(user.getUserRuby()+winnerRuby);
			log.info(user.getUserWin());
			user.setUserWin(user.getUserWin()+1);
			userService.modifyUser(user);

			//게임 진행에 필요한 정보들은 모두 서버에 저장되었으니 클라이언트에게 뿌려줄 정보를 다듬는다.
			List<PlayerInfo> piList =getClientPlayerInfoMsg(gpList, message) ;

			//어떤 행동을 했는지 확인!
			String bettingType = String.valueOf(message.getType());
			log.info("끝날 때 뭐 눌렀나 :" + bettingType);
			//RAISE했으면 얼만큼 레이즈했는지 알려줘야함. ex)RAISE 5
			if(bettingType.equals("RAISE")){
				bettingType+=(" " + message.getMessage());
			}

			//이 방에있는 플레이어들한테 각자 메시지 보내주자
			int idx = 0;
			for(GamePlayer gp : gpList){
				message.setMessage(bettingType);

				message.setType(MessageType.GAMEEND);


				//나를 기준으로 0번부터 보내주기.
				//piList2 = 각자 개인이 0번째인 piList
				List<PlayerInfo> piList2 = new ArrayList<>();
				for(int i = idx; i-idx< piList.size(); i++){
					piList2.add(piList.get(i%piList.size()));
				}

				//메시지에 위에서 만든 PlayerInfo를 담는다.
				message.setPlayerInfo(piList2);

				//turnIdx를 사람마다 각각 넣어주기
				int turnIdx = (winnerIdx)-idx;
				if(turnIdx<0)
					turnIdx+=gpList.size();
				message.setTurnIdx(turnIdx%piList.size());
				message.setWinnerIdx(turnIdx%piList.size());

				//기본 데이터들 서버 데이터로 바꿔주기
				settingBasicGameMessage(gp, message);
				template.convertAndSendToUser(gp.getSessionId(), "sub/game/room" + gp.getRoomId(), message);
				idx++;

			}

			// gamePlayer의 요소들 초기화
			for(GamePlayer gp : gpList){
				gp.setGameId(null);
				//이겼으면 myTurn true 졌으면 false
				if(gp.getUser().getUserNickname().equals(winnerNickname)) {
					gp.setMyTurn(true);
				}
				else{
					gp.setMyTurn(false);
				}
				gp.setMaxBetting(0);
				gp.setMyBetting(0);
				gp.setDie(false);
				gp.setMyCard(null);
				gp.setMyPair(null);
				gp.setGroundCard1(null);
				gp.setGroundCard2(null);
			}


			//겜 끝났으니까 tb_room roomIsStart false로 바꿔주기
			roomService.finishByRoomId(roomId);
		}



		//*******************게임 계속할거야. 다음사람한테 턴 넘겨!!*******************
		else{
			//gp에 myTurn이 true인 아이로 turnIdx설정
			//turnIdx 자기 기준으로 다시 보내주기위해서 gp기준 firstIdx찾기
			int currentTurn = 0;
			for(GamePlayer gp : gpList){
				if(gp.isMyTurn()){
					break;
				}
				currentTurn++;
			}

			log.info("방금 베팅 한 사람 gp순서로 : " + currentTurn);
			log.info("다음사람 ㄱㄱ");

			//이번 플레이어의 myTurn은 false로 바꿔주고 다음번 살아있는 애 true로 바꿔준다.
			int cnt = 1;
			while(gpList.get((currentTurn+cnt)%gpList.size()).isDie()){
				cnt++;
			}
			gpList.get(currentTurn).setMyTurn(false);
			gpList.get((currentTurn+cnt)%gpList.size()).setMyTurn(true);

			//어떤 행동을 했는지 확인!
			String bettingType = String.valueOf(message.getType());
			//RAISE했으면 얼만큼 레이즈했는지 알려줘야함. ex)RAISE 5
			if(bettingType.equals("RAISE")){
				bettingType+=(" " + message.getMessage());
			}
			message.setMessage(bettingType);

			//게임 진행에 필요한 정보들은 모두 서버에 저장되었으니 클라이언트에게 뿌려줄 정보를 다듬는다.
			List<PlayerInfo> piList =getClientPlayerInfoMsg(gpList, message) ;

			//각자한테 마스킹해서 보내주기.

			//이 방에있는 플레이어들한테 각자 메시지 보내주자
			int idx = 0;
			for(GamePlayer gp : gpList){
				message.setType(MessageType.NEXTTURN);

				//나를 기준으로 0번부터 보내주기.
				//piList2 = 각자 개인이 0번째인 piList
				List<PlayerInfo> piList2 = new ArrayList<>();
				for(int i = idx; i-idx< piList.size(); i++){
					piList2.add(piList.get(i%piList.size()));
				}

				//메시지에 위에서 만든 PlayerInfo를 담는다.
				message.setPlayerInfo(piList2);

				//turnIdx를 사람마다 각각 넣어주기
				int preTurnIdx =currentTurn-idx;
				int turnIdx = (currentTurn+cnt)-idx;
				if(turnIdx<0)
					turnIdx+=gpList.size();
				if(preTurnIdx<0)
					preTurnIdx+=gpList.size();
				message.setTurnIdx(turnIdx%piList.size());
				message.setPreTurnIdx(preTurnIdx%piList.size());

				//클라이언트에 보내주는 메세지 중 playerInfo에 내 정보에서 내카드, 내 족보는 알려주지 말자!!(카드:40으로 / 족보는 null로)
				String myPair = message.getPlayerInfo().get(0).getMyPair();
				message.getPlayerInfo().get(0).setMyCard(40);
				message.getPlayerInfo().get(0).setMyPair(null);

				//기본 데이터들 서버 데이터로 바꿔주기
				settingBasicGameMessage(gp, message);
				template.convertAndSendToUser(gp.getSessionId(), "sub/game/room" + gp.getRoomId(), message);

				//위에서 바꾼 내 카드 정보를 다시 원래대로 돌린다.
				message.getPlayerInfo().get(0).setMyCard(gp.getMyCard());
				message.getPlayerInfo().get(0).setMyPair(myPair);
				idx++;
			}

		}

	}

	/**
	 * 클라이언트 들에게 뿌려줄 정보 리스트를 반환해줌
	 */
	public List<PlayerInfo> getClientPlayerInfoMsg(List<GamePlayer> gpList, GameMessage message){
		//리스트 하나 만들어서
		List<PlayerInfo> infos = new ArrayList<>();
		//안에 정보들을 채워준다!
		for(GamePlayer gp : gpList){
			PlayerInfo info = new PlayerInfo();
			info.setNickname(gp.getUser().getUserNickname());
			info.setMyruby(gp.getUser().getUserRuby());
			info.setMytotalBet(gp.getMyBetting());
			if(gp.getMyCard()!=null){
				info.setMyCard(gp.getMyCard());
			}
			if(gp.getMyPair()!=null){
				Integer rank = gp.getMyPair();
				String myPair = "";
				switch (rank){
					case 0:
						myPair = "트리플";
						break;
					case 1:
						myPair = "스트레이트";
						break;
					case 2:
						myPair = "더블";
						break;
					case 3:
						myPair = "탑";
						break;
				}
				info.setMyPair((gp.getMyCard()/4 + 1) +" "+myPair);
			}
			infos.add(info);
		}
		//todo : gameTotalBet 구하는 방식 변경 : 사람 나갔을 때 고려(GP에 totalBet만들기) 해결
		//게임의 총 배팅 금액은 모든 플레이어에 저장되어있으니 첫번째 플레이어의 값으로 채워줌
		if(gpList.get(0).getGameTotalBet() != null){

			message.setGameTotalBet(gpList.get(0).getGameTotalBet());
		}else{
			message.setGameTotalBet(0);
		}
		return infos;
	}

	//게임 기본 정보들 메세지에 다시 서버 데이터로 채워주기 혹시 모를 클라이언트의 변조 데이터를 피하기 위함
	public void settingBasicGameMessage(GamePlayer gp, GameMessage message){
		message.setBattingUnit(gp.getBattingUnit());
		if(gp.getGroundCard1()!=null){
			message.setGroundCardNum1(gp.getGroundCard1());
			message.setGroundCardNum2(gp.getGroundCard2());
		}
		message.setRoomId(gp.getRoomId());
		if(gp.getGameId()!=null){
			message.setGameId(gp.getGameId());
		}
		message.setGameMaxBet(gp.getMaxBetting());
	}

	//족보 찾기
	public void getRank(List<GamePlayer> gpList){
		for(GamePlayer gp : gpList){
			int groundFirst = (gp.getGroundCard1() / 4) +1 ;
			int groundSecond = (gp.getGroundCard2() / 4) + 1;
			int myCard = (gp.getMyCard() / 4) + 1;
			int[] arr = { groundFirst, groundSecond, myCard };
			Arrays.sort(arr);

			// 트리플 확인
			if (checkTriple(arr)){
				gp.setMyPair(0);
				continue;
			}
			// 스트레이트 확인
			if (checkStraight(arr)){
				gp.setMyPair(1);
				continue;
			}
			// 더블 확인
			if (checkDouble(arr)){
				gp.setMyPair(2);
				continue;
			}
			// 아니면 탑
			gp.setMyPair(3);
		}
	}

	//게임의 우승자를 찾는 로직
	public int getWinner(List<GamePlayer> gpList){

		getRank(gpList);
		int winnerIdx = -1; //1등의 index
		int winnerRank = 5; //1등의 족보

		for (int i = 0; i < gpList.size(); i++) {
			GamePlayer gp = gpList.get(i);
			// 죽어있는 사람은 Pass
			if(gpList.get(i).isDie())
				continue;

			// 더 높은 족보면
			if (gp.getMyPair() < winnerRank) {
				winnerRank = gp.getMyPair();
				winnerIdx = i;
			}
			// 같은 족보면
			else if (gp.getMyPair() == winnerRank) {
				// 개인의 숫자가 더 높은애가 승리
				if (gpList.get(winnerIdx).getMyCard() < gpList.get(i).getMyCard()) {
					winnerRank = gp.getMyPair();
					winnerIdx = i;
				}
			}
		}
		return winnerIdx;
	}

	// 트리플
	private static boolean checkTriple(int[] cardArr) {
		if (cardArr[0] == cardArr[1]) {
			if (cardArr[1] == cardArr[2]) {
				return true;
			}
		}
		return false;
	}

	// 스트레이트
	private static boolean checkStraight(int[] cardArr) {
		if (cardArr[0] + 1 == cardArr[1]) {
			if (cardArr[1] + 1 == cardArr[2]) {
				return true;
			}
		}
		return false;
	}

	// 더블
	private static boolean checkDouble(int[] cardArr) {
		if (cardArr[0] == cardArr[1] || cardArr[0] == cardArr[2] || cardArr[1] == cardArr[2])
			return true;
		return false;
	}


	//소켓 끊김 감지
	public void onDisconnectEvent(String sessionId) {
		int roomId = gamePlayerRepository.findRoomBySesssionId(sessionId);

		// 방에 나가면 player를 한명 내려준다.
		roomSizeRepository.minusPlayerCnt(roomId);
		//room에 현재인원 감소 해결
		roomService.minusRoomInCnt(roomId);

		// gamePlayer에서 빼준다.
		//지운애가 방장이면 true 반환한다.
		boolean flag = gamePlayerRepository.deleteGamePlayer(roomId, sessionId);

		List<GamePlayer> gpList = gamePlayerRepository.getGamePlayer(roomId);

		//다 나갔으면 방 폭파
		if(gpList.size()==0){
			//tb_room의 isClose true로 바꿔주기.
			roomService.closeByRoomId(roomId);
		}else{
			//방장이 나가면 그 안에서 idx가 빠른애가 방장이 된다.
			if(flag) {
				gpList.get(0).setMyTurn(true);
			}

			//gp에 myTurn이 true인 아이로 turnIdx설정
			//turnIdx 자기 기준으로 다시 보내주기위해서 gp기준 firstIdx찾기
			int firstIdx = 0;
			for(GamePlayer gp : gpList){
				if(gp.isMyTurn()){
					break;
				}
				firstIdx++;
			}

			GameMessage message = new GameMessage();

			//게임 진행에 필요한 정보들은 모두 서버에 저장되었으니 클라이언트에게 뿌려줄 정보를 다듬는다.
			List<PlayerInfo> piList =getClientPlayerInfoMsg(gpList, message) ;

			//이 방에있는 플레이어들한테 각자 메시지 보내주자
			int idx = 0;
			for(GamePlayer gp : gpList){
				message.setType(MessageType.EXIT);

				//나를 기준으로 0번부터 보내주기.
				//piList2 = 각자 개인이 0번째인 piList
				List<PlayerInfo> piList2 = new ArrayList<>();
				for(int i = idx; i-idx< piList.size(); i++){
					piList2.add(piList.get(i%piList.size()));
				}
				//turnIdx를 사람마다 각각 넣어주기
				int turnIdx = firstIdx-idx;
				if(turnIdx<0)
					turnIdx+=gpList.size();
				message.setTurnIdx(turnIdx%piList.size());

				//메시지에 위에서 만든 PlayerInfo를 담는다.
				message.setPlayerInfo(piList2);

				message.setMessage(sessionId+"플레이어가 나가셨습니다.");
				//클라이언트에 보내주는 메세지 중 playerInfo에 내 정보에서 내카드, 내 족보는 알려주지 말자!!(카드:40으로 / 족보는 null로)
				if(message.getPlayerInfo().get(0).getMyPair()!=null){
					String myPair = message.getPlayerInfo().get(0).getMyPair();
					message.getPlayerInfo().get(0).setMyCard(40);
					message.getPlayerInfo().get(0).setMyPair(null);

					//기본 데이터들 서버 데이터로 바꿔주기
					settingBasicGameMessage(gp, message);
					template.convertAndSendToUser(gp.getSessionId(), "sub/game/room" + gp.getRoomId(), message);

					//위에서 바꾼 내 카드 정보를 다시 원래대로 돌린다.
					message.getPlayerInfo().get(0).setMyCard(gp.getMyCard());
					message.getPlayerInfo().get(0).setMyPair(myPair);
				}
				else{
					//기본 데이터들 서버 데이터로 바꿔주기
					settingBasicGameMessage(gp, message);
					template.convertAndSendToUser(gp.getSessionId(), "sub/game/room" + gp.getRoomId(), message);
				}
				idx++;
			}
		}
	}//session나가기 함수

}

// todo 게임끝날때 그전에 사람이 누른거 메시지 보내주기 -> Message에 알려주고 승리자는 winnerIdx로 알려주기
// todo 게임끝났을때 unitBetting보다 돈 없는애 강퇴 -> 프론트에서 구현
// todo GameEnd 메시지에도 정보 넣어주기 -> 해결
// todo EXIT 메시지에 turnIdx 넣어주기 -> 해결
// todo 게임방 6명이상이면 못들어가게 -> 해결

// todo gameTotalBet 구하는 방식 변경 : 사람 나갔을 때 고려(GP에 totalBet만들기) -> 해결
// todo room에 현재인원 추가 -> 해결
// todo mission null값으로 넘어가는것 알려주기 -> 해결
// todo 돈 적은애가 콜 누르면 allIn으로 가게? 올인이 아직 완벽하지 않다..?