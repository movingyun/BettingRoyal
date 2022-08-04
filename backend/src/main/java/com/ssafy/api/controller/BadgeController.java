package com.ssafy.api.controller;

import com.ssafy.api.request.BadgeModifyReq;
import com.ssafy.api.request.BadgeRegistReq;
import com.ssafy.api.service.BadgeService;
import com.ssafy.api.service.UserService;
import com.ssafy.db.entity.Badge;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Api(value = "뱃지 API", tags = {"Badge"})
@RestController
@RequestMapping("/api/badge")
public class BadgeController {

    @Autowired
    private BadgeService badgeService;

    @Autowired
    private UserService userService;

    @ApiOperation(value = "뱃지 등록", notes = "뱃지 등록 성공 여부를 보여준다.")
    @PostMapping("")
    public ResponseEntity<String> badgeRegist(@RequestBody BadgeRegistReq badgeRegistReq){
        Badge badge = Badge.builder()
                .badgeName(badgeRegistReq.getBadgeName())
                .badgeImg(badgeRegistReq.getBadgeImg())
                .badgeCondition(badgeRegistReq.getBadgeCondition())
                .build();

        badgeService.createBadge(badge);

        return new ResponseEntity<>("SUCCESS", HttpStatus.OK);
    }

    @ApiOperation(value = "뱃지 수정", notes = "뱃지 수정 성공 여부를 보여준다.")
    @PutMapping("")
    public ResponseEntity<String> badgeModify(@RequestBody BadgeModifyReq badgeModifyReq){

        Badge badge = badgeService.searchBadge(badgeModifyReq.getBadgeId());
        badge.setBadgeName(badgeModifyReq.getBadgeName());
        badge.setBadgeImg(badgeModifyReq.getBadgeImg());
        badge.setBadgeCondition(badgeModifyReq.getBadgeCondition());

        badgeService.modifyBadge(badge);
        return new ResponseEntity<>("SUCCESS", HttpStatus.OK);
    }

    @ApiOperation(value = "뱃지 삭제", notes = "뱃지 삭제 성공 여부를 보여준다.")
    @DeleteMapping("")
    public ResponseEntity<String> badgeDelete(@RequestParam int badgeId){

        badgeService.deleteBadge(badgeId);
        return new ResponseEntity<>("SUCCESS", HttpStatus.OK);
    }

    @ApiOperation(value = "뱃지 목록", notes = "뱃지 목록을 받아온다.")
    @GetMapping("")
    public ResponseEntity<List<Badge>> getBadges(){

        return new ResponseEntity<>(badgeService.searchBadges(), HttpStatus.OK);
    }
}
