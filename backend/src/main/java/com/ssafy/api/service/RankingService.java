package com.ssafy.api.service;

import com.ssafy.api.response.RankingRes;
import com.ssafy.db.entity.Ranking;
import com.ssafy.db.entity.User;
import com.ssafy.db.repository.RankingRepository;
import com.ssafy.db.repository.RoomRepository;
import com.ssafy.db.repository.UserRepository;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;

import java.util.List;

@Service
public class RankingService {

    @Autowired
    private RoomRepository roomRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RankingRepository rankingRepository;

    //cron = "초 분 시 월 일 요일" 순서로 작성
    // 아래 적은것은 매일 0시 0분 0초에 실행
    @Scheduled(cron = "0 0 0 * * *")
    public void rankingUpdate(){
        List<User> users = userRepository.findTop20User();
        for(int i = 0; i < 20; i++){
            Ranking ranking = new Ranking();
            if(users.size() > i){
                ranking.setRankingRank(i+1);
                ranking.setRankingUserNickname(users.get(i).getUserNickname());
                ranking.setRankingUserRuby(users.get(i).getUserRuby()+users.get(i).getUserVault());
                ranking.setRankingUserTotal(users.get(i).getUserGameCount() + "전 " + users.get(i).getUserWin() + "승 "
                + (users.get(i).getUserGameCount()-users.get(i).getUserWin()) + "패 (" +
                String.format("%.2f", (users.get(i).getUserWin()/ (float)(users.get(i).getUserGameCount()==0?1: users.get(i).getUserGameCount())*100))
                + "%)");
            }else{
                ranking.setRankingRank(i+1);
                ranking.setRankingUserNickname(null);
                ranking.setRankingUserRuby(null);
            }
            createRanking(ranking);
        }
    }

    @Transactional
    public void createRanking(Ranking ranking){
        rankingRepository.save(ranking);
    }

    public List<Ranking> getRankings(){
        return rankingRepository.findByLast20();
    }
}
