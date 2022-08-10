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
        }

        // message에 maxBetting 올려주기
        message.setGameMaxBet(maxBet);

        // tb_GameInfo에서 rubyGet minus해주기
        gameInfoService.callBetting(gameId, bettingUser.getUserId(), callBettingCnt);

        // tb_User에서 ruby minus해주기(gp에 있는 User를 변경)
        bettingUser.setUserRuby(bettingUser.getUserRuby()-callBettingCnt);
        userService.modifyUser(bettingUser);
    }

    public void raise(int roomId, String userInfo, GameMessage message){
        List<GamePlayer> gpList = gamePlayerRepository.getGamePlayer(roomId);

        User bettingUser = new User();
        int gameId = 0;

        //얼마나 raise?
        int raiseCnt = Integer.parseInt(message.getMessage());
        log.info(raiseCnt+"만큼 레이즈 ㄱㄱ");
        //todo : 자기가 가진 돈 보다 더 많이 raise할 수 없다.

        //(Server) GamePlayer에서 myBetting plus 해주고 raiseBetting(callBettingCnt+raiseCnt) 돌려주기
        int raiseBetting = gamePlayerRepository.raiseBetting(roomId, userInfo, raiseCnt);
        int MaxBet = 0;
        for(GamePlayer gp : gpList){
            //모든 gp.MaxBetting 올려주기
            MaxBet = gp.getMaxBetting()+raiseCnt;
            gp.setMaxBetting(MaxBet);
            if(gp.getSessionId().equals(userInfo)){
                bettingUser = gp.getUser();
                gameId = gp.getGameId();
                //raise한 사람의 gp.myBet 올려주기
                gp.setMyBetting(MaxBet);
            }
        }

        // message에 maxBetting 올려주기
        message.setGameMaxBet(MaxBet);

        //(DB) GameInfo에서 rubyGet minus해주기
        gameInfoService.raiseBetting(gameId, bettingUser.getUserId(), raiseBetting);

        // tb_User에서 ruby minus해주기
        bettingUser.setUserRuby(bettingUser.getUserRuby()-raiseBetting);
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
