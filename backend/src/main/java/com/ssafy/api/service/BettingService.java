package com.ssafy.api.service;

import com.ssafy.db.entity.GameMessage;
import com.ssafy.db.entity.GamePlayer;
import com.ssafy.db.entity.User;
import com.ssafy.db.repository.GamePlayerRepository;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Log4j2
public class BettingService {

    @Autowired
    private GamePlayerRepository gamePlayerRepository;
    @Autowired
    private GameInfoService gameInfoService;
    @Autowired
    private UserService userService;


    public void call(int roomId, String userInfo, GameMessage message){
        List<GamePlayer> gpList = gamePlayerRepository.getGamePlayer(roomId);

        User bettingUser = new User();
        int gameId = 0;
        int maxBet = 0;

        // GamePlayer에서 myBetting plus 해주고 callBettingCnt 돌려주기
        int callBettingCnt = gamePlayerRepository.callBetting(roomId, userInfo);

        // gp 돌면서 sessionId로 정보 가져오고 gp.myBet 올려주기
        for(GamePlayer gp : gpList){
            if(gp.getSessionId().equals(userInfo)){
                maxBet = gp.getMaxBetting();
                bettingUser = gp.getUser();
                gameId = gp.getGameId();
                //gp.myBet 올려주기
                gp.setMyBetting(gp.getMyBetting()+callBettingCnt);
            }
            //todo : gameTotalBet 구하는 방식 변경 : 사람 나갔을 때 고려(GP에 totalBet만들기) 해결
            //모든 gp에 게임의 총 배팅을 콜 배팅 만큼 늘려준다
            gp.setGameTotalBet(gp.getGameTotalBet()+callBettingCnt);
        }

        // message에 maxBetting 올려주기
        message.setGameMaxBet(maxBet);

        // tb_GameInfo에서 rubyGet minus해주기
        gameInfoService.callBetting(gameId, bettingUser.getUserId(), callBettingCnt);

        // tb_User에서 ruby minus해주기(gp에 있는 User를 변경)
        bettingUser.setUserRuby(bettingUser.getUserRuby()-callBettingCnt);
        userService.modifyUser(bettingUser);
    }

    public boolean raise(int roomId, String userInfo, GameMessage message){
        List<GamePlayer> gpList = gamePlayerRepository.getGamePlayer(roomId);

        User bettingUser = new User();
        int gameId = 0;

        //얼마나 raise?
        int raiseCnt = Integer.parseInt(message.getMessage());
        int callBetting = 0;
        log.info(raiseCnt+"만큼 레이즈 ㄱㄱ");

        //todo : 자기가 가진 돈 보다 더 많이 raise할 수 없다.
        for(GamePlayer gp : gpList){
            if(gp.getSessionId().equals(userInfo)){
                bettingUser = gp.getUser();
                callBetting = gp.getMaxBetting()-gp.getMyBetting();
            }
        }

        if(raiseCnt+callBetting>bettingUser.getUserRuby()){
            return false;
        }

        //(Server) GamePlayer에서 myBetting plus 해주고 raiseBetting(callBettingCnt+raiseCnt) 돌려주기
        int raiseBetting = gamePlayerRepository.raiseBetting(roomId, userInfo, raiseCnt);
        int MaxBet = 0;
        for(GamePlayer gp : gpList){
            log.info("여기 들어왔니 : " +userInfo + "  /  gpsession : "+gp.getSessionId());
            //모든 gp.MaxBetting 올려주기
            MaxBet = gp.getMaxBetting()+raiseCnt;
            gp.setMaxBetting(MaxBet);
            if(gp.getSessionId().equals(userInfo)){
                gameId = gp.getGameId();
                //raise한 사람의 gp.myBet 올려주기
                gp.setMyBetting(MaxBet);
            }
            //todo : gameTotalBet 구하는 방식 변경 : 사람 나갔을 때 고려(GP에 totalBet만들기) 해결
            //모든 gp에 게임의 총 배팅을 레이즈 금액 만큼 늘려준다
            gp.setGameTotalBet(gp.getGameTotalBet() + raiseBetting);
        }

        // message에 maxBetting 올려주기
        message.setGameMaxBet(MaxBet);

        //(DB) GameInfo에서 rubyGet minus해주기
//        log.info("raise service amount : " + bettingUser);
        log.info(gameId);
        log.info(bettingUser.getUserId());
        log.info(raiseBetting);
        gameInfoService.raiseBetting(gameId, bettingUser.getUserId(), raiseBetting);

        // tb_User에서 ruby minus해주기
        bettingUser.setUserRuby(bettingUser.getUserRuby()-raiseBetting);
        userService.modifyUser(bettingUser);

        return true;
    }

    public void allIn(int roomId, String userInfo, GameMessage message){
        List<GamePlayer> gpList = gamePlayerRepository.getGamePlayer(roomId);

        User bettingUser = new User();
        int gameId = 0;

        //콜 비용
        int callBettingcnt = 0;

        //(Server) GamePlayer에서 myBetting plus 해주고 allInBettingCnt 돌려주기
        int allInBettingCnt = gamePlayerRepository.allInBetting(roomId, userInfo);

        // gp 돌면서 sessionId로 정보 가져오기
        for(GamePlayer gp : gpList){
            //모든 gp.MaxBetting 올려주기((Allin한 사람의 myRuby + Allin한 사람의 myBet)
            if(gp.getSessionId().equals(userInfo)){
                callBettingcnt = gp.getMaxBetting()-gp.getMyBetting();
                bettingUser = gp.getUser();
                gameId = gp.getGameId();
                gp.setMyBetting(gp.getMyBetting()+bettingUser.getUserRuby());
            }
        }

        //gp의 MaxBet 바꿔줌.
        //allInBettingCnt가 0보다 작으면 현재 최대 배팅 금액보다 내 올인 금액이 적어서 업데이트 해줄 필요가 없음!
        if(allInBettingCnt >= 0) {
            for (GamePlayer gp : gpList) {
                gp.setMaxBetting(gp.getMaxBetting() + allInBettingCnt);

                //todo : gameTotalBet 구하는 방식 변경 : 사람 나갔을 때 고려(GP에 totalBet만들기) 해결
                //모든 gp에 게임의 총 배팅을 레이즈 금액 만큼 늘려준다
                gp.setGameTotalBet(gp.getGameTotalBet() + bettingUser.getUserRuby());
            }
            // message에 maxBetting 올려주기
            message.setGameMaxBet(message.getGameMaxBet()+allInBettingCnt);

            //(DB) GameInfo에서 allInBettingCnt만큼 rubyGet minus해주기
            gameInfoService.allInBetting(gameId, bettingUser.getUserId(), allInBettingCnt+callBettingcnt);
        }else{//allInBettingCnt가 음수면 현재 맥스베팅 금액보다 내가 가진 돈이 적으니 내 돈 전부를 건다!
            //message에 maxBetting 올려줄 필요 없음! 내 돈이 콜보다 적어서 맥스가 아니니!

            //내 돈도 올인만큼 줄이면 음수여서 +가 되기 때문에 내가 가진 돈 전부를 보내준다!
            gameInfoService.allInBetting(gameId, bettingUser.getUserId(), bettingUser.getUserRuby());

            for (GamePlayer gp : gpList) {
                //todo : gameTotalBet 구하는 방식 변경 : 사람 나갔을 때 고려(GP에 totalBet만들기) 해결
                //모든 gp에 게임의 총 배팅을 레이즈 금액 만큼 늘려준다
                gp.setGameTotalBet(gp.getGameTotalBet() + bettingUser.getUserRuby());
            }
        }



        // tb_User에서 ruby minus해주기
        bettingUser.setUserRuby(0);
        userService.modifyUser(bettingUser);
    }

    //첫 턴에는 call 못하게 해야한다.
    public boolean checkFirstBetting(List<GamePlayer> gpList, String userInfo){
        boolean isFirstBetting = false;
        for(GamePlayer gp : gpList){
            if(gp.getSessionId().equals(userInfo)){
                if(gp.getMaxBetting()==gp.getBattingUnit()){
                    isFirstBetting=true;
                    break;
                }
            }
        }
        return isFirstBetting;
    }

    public boolean checkBettingTurn(List<GamePlayer> gpList, String userInfo){
        boolean isMyTurn = true;
        //이거 요청이 맞는 순서인 유저한테 들어온건지 확인
        for(GamePlayer gp : gpList){
            if(gp.getSessionId().equals(userInfo)){
                if(!gp.isMyTurn()){
                    isMyTurn=false;
                    break;
                }
            }
        }
        return isMyTurn;
    }

}
