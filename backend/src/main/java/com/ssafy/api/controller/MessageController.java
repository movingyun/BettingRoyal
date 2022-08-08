package com.ssafy.api.controller;

import com.ssafy.api.service.RoomService;
import com.ssafy.api.service.UserService;
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
import com.ssafy.api.service.GameInfoService;
import com.ssafy.api.service.GameService;
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
			gamePlayerRepository.addGamePlayer(message, headerAccessor.getUser().getName());

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

			//방 정보 가져와서 기본 배팅 금액 가져오기
			Room room = roomService.getRoom(roomId);
			int bettingUnit = room.getRoomBettingUnit();

			//이 방에서 게임하고있는 플레이어들
			List<GamePlayer> thisGamePlayer = gamePlayerRepository.getGamePlayer(message.getRoomId());

			// 사람들한테 bettingUnit만큼 돈 내게하기
			message.setMessage("기본 베팅금액을 베팅하십시오.");
			message.setType(MessageType.UNITBETTING);
			//기본 베팅한 것 판돈 올려주기
			message.setGameTotalBet(message.getGameTotalBet()+ (bettingUnit*thisGamePlayer.size()));
			template.convertAndSend("/sub/game/room" + roomId, message);


			// 게임 방 안의 모든 유저 돈 내고 게임 한 판 추가
			for(GamePlayer gp : thisGamePlayer){
				//디비에 유저에서도 업데이트 해줌
				User temp = gp.getUser();
				temp.setUserRuby(temp.getUserRuby()-bettingUnit);
				temp.setUserGameCount(temp.getUserGameCount()+1);
				userService.modifyUser(temp);
				//게임 유저들 게임 배팅 정보 업데이트
				gp.setMaxBetting(gp.getMaxBetting()+bettingUnit);
				gp.setMyBetting(gp.getMyBetting()+bettingUnit);
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
						thisGamePlayer.get(i).setMyCard(playerCard);
						//공통 카드도 넣어주기
						thisGamePlayer.get(i).setGroundCard1(groundCard1);
						thisGamePlayer.get(i).setGroundCard2(groundCard2);
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

			//게임 진행에 필요한 정보들은 모두 서버에 저장되었으니 클라이언트에게 뿌려줄 정보를 다듬는다. todo
			message.setPlayerInfo(getClientPlayerInfoMsg(thisGamePlayer, message));

			//이 방에있는 플레이어들한테 각자 메시지 보내주자
			int idx = 0;
			for(GamePlayer gp : thisGamePlayer){
				//서버에서 저장하는 이 방에서 게임하는 플레이어들의 게임 아이디를 저장해주자
				gp.setGameId(gameId);
				//서버에서 저장하는 이 방에서 게임하는 플레이어들에게 방의 기본 베팅도 저장해주자
				gp.setBattingUnit(bettingUnit);

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

				// tb_game_info생성 후 게임id, 플레이어, 개인카드 입력
				gameInfoService.createGameInfo(gameId, gp.getUser(), myCard);

				// Do it : 기본베팅한거 DB넣어주기!!

				//클라이언트에 보내주는 메세지 중 playerInfo에 내 정보에는 내 카드를 알려주면 안된다! 0~39 이니 40으로 잠시 설정해둠
				message.getPlayerInfo().get(idx-1).setMyCard(40);
				//기본 데이터들 서버 데이터로 바꿔주기
				settingBasicGameMessage(gp, message);
				template.convertAndSendToUser(gp.getSessionId(), "sub/game/room" + gp.getRoomId(), message);
				//위에서 바꾼 내 카드 정보를 다시 원래대로 돌린다.
				message.getPlayerInfo().get(idx-1).setMyCard(gp.getMyCard());
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
			// call한 사람 sessionId
			String userInfo = headerAccessor.getUser().getName();
			User bettingUser = new User();
			int gameId = 0;
			int roomId =  message.getRoomId();
			List<GamePlayer> gpList = gamePlayerRepository.getGamePlayer(roomId);

			//sessiond로 GamePlayer를 찾아서 걔의 턴이 아니면 그냥 return
			for(GamePlayer gp : gpList){
				if(gp.getSessionId().equals(userInfo)){
					if(!gp.isMyTurn()){
						log.info("너 차례 아니야");
						return;
					}
				}
			}

			// GamePlayer에서 myBetting plus 해주고 callBettingCnt 돌려주기
			int callBettingCnt = gamePlayerRepository.callBetting(roomId, userInfo);

			// gp 돌면서 sessionId로 정보 가져오고 gp.myBet 올려주기
			for(GamePlayer gp : gpList){
				if(gp.getSessionId().equals(userInfo)){
					bettingUser = gp.getUser();
					gameId = gp.getGameId();
					//gp.myBet 올려주기
					gp.setMyBetting(gp.getMyBetting()+callBettingCnt);
				}
			}

			// tb_GameInfo에서 rubyGet minus해주기
			gameInfoService.callBetting(gameId, bettingUser.getUserNickname(), callBettingCnt);

			// tb_User에서 ruby minus해주기(gp에 있는 User를 변경)
			bettingUser.setUserRuby(bettingUser.getUserRuby()-callBettingCnt);
			userService.modifyUser(bettingUser);

			// 끝났는지체크


			// 다음턴으로 넘기고 그사람한테 배팅하라고 알려줌
		}

		// 다이가 들어왔을 때
		if (message.getType().equals(MessageType.DIE)) {
			int roomId =  message.getRoomId();
			List<GamePlayer> gpList = gamePlayerRepository.getGamePlayer(roomId);
			String userInfo = headerAccessor.getUser().getName();

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


			// 다음턴으로 넘기고 그사람한테 배팅하라고 알려줌
		}

		// 레이즈가 들어왔을 때
		if (message.getType().equals(MessageType.RAISE)) {
			//roomId와 sessiond로 GamePlayer를 찾아서 걔의 myTurn이 true인지 확인
			int roomId =  message.getRoomId();
			List<GamePlayer> gpList = gamePlayerRepository.getGamePlayer(roomId);
			String userInfo = headerAccessor.getUser().getName();
			int gameId = 0;
			User bettingUser = new User();

			//sessiond로 GamePlayer를 찾아서 걔의 턴이 아니면 그냥 return
			for(GamePlayer gp : gpList){
				if(gp.getSessionId().equals(userInfo)){
					if(!gp.isMyTurn()){
						log.info("너 차례 아니야");
						return;
					}
				}
			}

			//얼마나 raise?
			int raiseCnt = Integer.parseInt(message.getMessage());

			//todo : 자기가 가진 돈 보다 더 많이 raise할 수 없다.

			//(Server) GamePlayer에서 myBetting plus 해주고 raiseBetting(callBettingCnt+raiseCnt) 돌려주기
			int raiseBetting = gamePlayerRepository.raiseBetting(roomId, userInfo, raiseCnt);

			for(GamePlayer gp : gpList){
				//모든 gp.MaxBetting 올려주기
				gp.setMaxBetting(gp.getMaxBetting()+raiseCnt);
				if(gp.getSessionId().equals(userInfo)){
					bettingUser = gp.getUser();
					gameId = gp.getGameId();
					//raise한 사람의 gp.myBet 올려주기
					gp.setMyBetting(gp.getMyBetting()+raiseBetting);
				}
			}

			//(DB) GameInfo에서 rubyGet minus해주기
			gameInfoService.raiseBetting(gameId, userInfo, raiseBetting);

			// tb_User에서 ruby minus해주기
			bettingUser.setUserRuby(bettingUser.getUserRuby()-raiseBetting);
			userService.modifyUser(bettingUser);

			// 끝났는지체크

			// 다음턴으로 넘기고 그사람한테 배팅하라고 알려줌
		}

		// 올인이 들어왔을 때
		if (message.getType().equals(MessageType.ALLIN)) {
			int roomId =  message.getRoomId();
			List<GamePlayer> gpList = gamePlayerRepository.getGamePlayer(roomId);
			String userInfo = headerAccessor.getUser().getName();
			int gameId = 0;
			User bettingUser = new User();

			//sessiond로 GamePlayer를 찾아서 걔의 턴이 아니면 그냥 return
			for(GamePlayer gp : gpList){
				if(gp.getSessionId().equals(userInfo)){
					if(!gp.isMyTurn()){
						log.info("너 차례 아니야");
						return;
					}
				}
			}

			//올인을 하기 위해서 내는 루비(내 돈 - 콜 비용)
			int rubyForAllIn = 0;

			//(Server) GamePlayer에서 myBetting plus 해주고 allInBettingCnt 돌려주기
			int allInBettingCnt = gamePlayerRepository.allInBetting(roomId, userInfo);

			// gp 돌면서 sessionId로 정보 가져오기
			List<GamePlayer> gpList = gamePlayerRepository.getGamePlayer(roomId);
			for(GamePlayer gp : gpList){
				//모든 gp.MaxBetting 올려주기((Allin한 사람의 myRuby + Allin한 사람의 myBet)
				if(gp.getSessionId().equals(userInfo)){
					bettingUser = gp.getUser();
					gameId = gp.getGameId();
					rubyForAllIn = bettingUser.getUserRuby() - (gp.getMaxBetting()-gp.getMyBetting());
					gp.setMyBetting(gp.getMyBetting()+bettingUser.getUserRuby());
				}
			}

			//gp의 MaxBet 바꿔줌.
			for(GamePlayer gp : gpList){
				gp.setMaxBetting(gp.getMaxBetting()+rubyForAllIn);
			}

			//(DB) GameInfo에서 allInBettingCnt만큼 rubyGet minus해주기
			gameInfoService.allInBetting(gameId, bettingUser.getUserNickname(), allInBettingCnt);

			// tb_User에서 ruby minus해주기
			bettingUser.setUserRuby(0);
			userService.modifyUser(bettingUser);

			// 끝났는지체크
			checkFinish(message, headerAccessor);

			// 다음턴으로 넘기고 그사람한테 배팅하라고 알려줌
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

			message.setMessage(message.getSenderNickName()+" 플레이어가 퇴장하셨습니다.");
			template.convertAndSend("/sub/game/room" + message.getRoomId(), message);
		}

	}


	//다음 사람을 비교해서 게임 종료 여부와 다음 차례인 사람을 찾는 함수
	public void checkFinish(GameMessage message, SimpMessageHeaderAccessor headerAccessor) {
		//게임방에 참여중인 참가자들을 구한다
		List<GamePlayer> gp = gamePlayerRepository.getGamePlayer(message.getRoomId());

		//finishCnt와 dieCnt를 활용해서 게임이 끝났는지 확인
		//finishCnt = dieCnt + (userBetting==MaxBetting)Cnt
		int finishCnt = 0;
		int dieCnt = 0;
		int winnerRuby = 0;
		for(GamePlayer player : gp){
			winnerRuby+=player.getMyBetting();
			//플레이어의 베팅이 기본베팅이 아니면서 maxBetting이랑 같으면 finishCnt올려준다.
			if(player.getMyBetting()!=player.getBattingUnit()&&player.getMyBetting()==player.getMaxBetting()){
				finishCnt++;
				continue;
			}
			else if(player.isDie()){
				finishCnt++;
				dieCnt++;
				continue;
			}
			//하나라도 충족못하면 다음턴 진행해야된다.
			break;
		}

		//finishCnt가 gameSize거나
		//dieCnt가 gameSize-1이면 게임을 끝낸다.
		int gameSize = gp.size();
		//******************************게임 끝남!!!!******************************
		if(finishCnt==gameSize||dieCnt==gameSize-1){
			// Do it : 누가 이겼는지 확인해보자.
			int winnerIdx = getWinner(gp);

			// Do it : 메세지(Message.setMessage)에 누가 이겼는지 알려줘야 함
			message.setMessage(gp.get(winnerIdx).getUser().getUserNickname());

			// Do it : tb_gameInfo에 이긴사람은 루비획득+해주고 승리여부 이긴거 기록해줘야함.
			int gameId = gp.get(winnerIdx).getGameId();
			String winnerNickname = gp.get(winnerIdx).getUser().getUserNickname();
			gameInfoService.winnerGetRubyAndWriteWin(gameId, winnerNickname, winnerRuby);

			// Do it : tb_game에 승자 기록
			Game game = gameRepository.findByGameId(gameId);
			game.setGameWinner(gp.get(winnerIdx).getUser().getUserId());
			gameService.modifyGame(game);

			// Do it : tb_user의 승수,루비 수 올려주기
			User user = userRepository.findByUserNickname(winnerNickname);
			user.setUserRuby(user.getUserRuby()+winnerRuby);
			userService.modifyUser(user);

			// Do it : gamePlayer의 요소들 초기화
			for(GamePlayer player : gp){
				player.setGameId(null);
				//이겼으면 myTurn true 졌으면 false
				if(player.getUser().getUserNickname().equals(winnerNickname))
					player.setMyTurn(true);
				else{
					player.setMyTurn(false);
				}
				player.setMaxBetting(0);
				player.setMyBetting(0);
				player.setDie(false);
				player.setMyCard(null);
				player.setBattingUnit(0);
				player.setGroundCard1(null);
				player.setGroundCard2(null);
			}

			//끝났다고 알려줘~~!!
			message.setType(MessageType.GAMEEND);
			template.convertAndSend("/sub/game/room" + message.getRoomId(), message);
		}



		//*******************게임 계속할거야. 다음사람한테 턴 넘겨!!*******************
		else{
			//이번 플레이어의 myTurn은 false로 바꿔주고 다음번 애 true로 바꿔준다.


			//turnIdx++ 해주기
			message.setTurnIdx(message.getTurnIdx()+1);
			//어떤 행동을 했는지 확인!
			String bettingType = String.valueOf(message.getType());
			//RAISE했으면 얼만큼 레이즈했는지 알려줘야함. ex)RAISE 5
			if(bettingType.equals("RAISE")){
				bettingType+=(" " + message.getMessage());
			}
			message.setMessage(bettingType);
			message.setType(MessageType.NEXTTURN);

			//각자한테 마스킹해서 보내주기.
		}

	}

	/**
	 * 클라이언트 들에게 뿌려줄 정보 리스트를 반환해줌
	 */
	public List<PlayerInfo> getClientPlayerInfoMsg(List<GamePlayer> thisGamePlayer, GameMessage message){
		//리스트 하나 만들어서
		List<PlayerInfo> infos = new ArrayList<>();
		//총 배팅 금액도 더해서 메세지에 넣어주기.
		int gameTotalBet = 0;
		//안에 정보들을 채워준다!
		for(GamePlayer gp : thisGamePlayer){
			PlayerInfo info = new PlayerInfo();
			info.setNickname(gp.getUser().getUserNickname());
			info.setMyruby(gp.getUser().getUserRuby());
			info.setMytotalBet(gp.getMyBetting());
			info.setMyCard(gp.getMyCard());
			infos.add(info);
			gameTotalBet += gp.getMyBetting();
		}

		message.setGameTotalBet(gameTotalBet);

		return infos;
	}

	//게임 기본 정보들 메세지에 다시 서버 데이터로 채워주기 혹시 모를 클라이언트의 변조 데이터를 피하기 위함
	public void settingBasicGameMessage(GamePlayer gp, GameMessage message){
		message.setBattingUnit(gp.getBattingUnit());
		message.setGroundCardNum1(gp.getGroundCard1());
		message.setGroundCardNum2(gp.getGroundCard2());
		message.setRoomId(gp.getRoomId());
		message.setGameId(gp.getGameId());
	}

	//게임의 우승자를 찾는 로직
	public int getWinner(List<GamePlayer> gamePlayerList){
		for(GamePlayer gp : gamePlayerList){
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


		int winnerIdx = -1; //1등의 index
		int winnerRank = 5; //1등의 족보

		for (int i = 0; i < gamePlayerList.size(); i++) {
			GamePlayer gp = gamePlayerList.get(i);
			// 죽어있는 사람은 Pass
			if(gamePlayerList.get(i).isDie())
				continue;

			// 더 높은 족보면
			if (gp.getMyPair() < winnerRank) {
				winnerRank = gp.getMyPair();
				winnerIdx = i;
			}
			// 같은 족보면
			else if (gp.getMyPair() == winnerRank) {
				// 개인의 숫자가 더 높은애가 승리
				if (gamePlayerList.get(winnerIdx).getMyCard() < gamePlayerList.get(i).getMyCard()) {
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
	//todo 플레이어 나가는거 확인하기!!
	@EventListener
	public void onDisconnectEvent(SessionDisconnectEvent event) {
//		LOGGER.debug("Client with username {} disconnected", event.getUser());
		//System.out.println("user left : "+event.getUser().getName());
		String sessionid = event.getUser().getName();
		int roomid = gamePlayerRepository.findRoomBySesssionId(sessionid);
		boolean flag = gamePlayerRepository.deleteGamePlayer(roomid, sessionid);

		if(roomid!=-1){
			roomSizeRepository.minusPlayerCnt(roomid);

			//인원 0 되면 방 지우기
			if(roomSizeRepository.getRoomSize(roomid) <=0) {
				roomService.deleteByRoomId(roomid);
				System.out.println("room deleted : " + roomid);
			}else{
				// gamePlayer에서 빼준다.
				//지운애가 방장이면 true 반환한다.
				//방장 지웠으면 그 다음애 true
				if(flag) {
					gamePlayerRepository.getGamePlayer(roomid).get(0).setMyTurn(true);
				}

				GameMessage message = new GameMessage();
				message.setPlayerInfo(gamePlayerRepository.getGamePlayer(roomid));
				message.setType(MessageType.EXIT);
				message.setMessage(sessionid+" 플레이어가 퇴장하셨습니다.");
				template.convertAndSend("/sub/game/room" + roomid, message);

			}
		}

	}
}

//todo 나를 기준으로 0번부터 보내주기