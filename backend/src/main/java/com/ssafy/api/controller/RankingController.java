package com.ssafy.api.controller;

import com.ssafy.api.response.RankingRes;
import com.ssafy.api.service.RankingService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@Api(value = "유저 API", tags = {"Rank"})
@RestController
@RequestMapping("/api/rank")
public class RankingController {

    @Autowired
    RankingService rankingService;

    @GetMapping("")
    @ApiOperation(value = "랭킹 조회", notes = "전체 랭킹 확인")
    @ApiResponses({
            @ApiResponse(code = 200, message = "성공"),
            @ApiResponse(code = 401, message = "인증 실패"),
            @ApiResponse(code = 404, message = "사용자 없음"),
            @ApiResponse(code = 500, message = "서버 오류")
    })
    public ResponseEntity<List<RankingRes>> getAllRank(){
        return  null;
    }
}