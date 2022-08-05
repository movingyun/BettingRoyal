package com.ssafy.api.controller;

import com.ssafy.api.request.BadgeRegistReq;
import com.ssafy.api.service.BadgeOwnService;
import com.ssafy.api.service.BadgeService;
import com.ssafy.api.service.UserService;
import com.ssafy.common.auth.SsafyUserDetails;
import com.ssafy.db.entity.Badge;
import com.ssafy.db.entity.BadgeOwn;
import com.ssafy.db.entity.User;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import springfox.documentation.annotations.ApiIgnore;

@Api(value = "뱃지 보유 API", tags = {"BadgeOwn"})
@RestController
@RequestMapping("/api/badgeown")
public class BadgeOwnController {

    @Autowired
    private BadgeOwnService badgeOwnService;

    @Autowired
    private BadgeService badgeService;

    @Autowired
    private UserService userService;

    @ApiOperation(value = "뱃지 얻기", notes = "얻은 뱃지 이름을 알려줍니다.")
    @PostMapping("")
    public ResponseEntity<String> getBadge(@ApiIgnore Authentication authentication){
        //로그인 한 user정보 찾아오는 code
        //스켈레톤 코드 UserController에서 가져옴
        SsafyUserDetails userDetails = (SsafyUserDetails) authentication.getDetails();
        String userEmail = userDetails.getUsername();
        User user = userService.getUserByUserEmail(userEmail);
        BadgeOwn badgeOwn = null;
        String gettingBadgeName = null;
        /**
         * todo
         * 뱃지 새로 만들 때 마다 뱃지 얻는 방법에 맞춰 뱃지 얻는 경우를 user의 값을 이용해 업데이트 해주기
         */

        /**
         * 예제 시작 : 뱃지 얻는 조건을 통해 뱃지 얻은것을 알려주고 DB에 저장
         */
        if(user.getUserRuby() + user.getUserVault() > 100){//유저 총 보유 금액이 얼마보다 많으면
            badgeOwn = BadgeOwn.builder()
                    .badge(badgeService.searchBadge(3)) //n번째 뱃지의 규칙의 if문임
                    .user(user)
                    .build();

            badgeOwnService.createBadgeOwn(badgeOwn);
            gettingBadgeName = badgeOwn.getBadge().getBadgeName(); // 얻은 뱃지의 이름을 넘겨줌
        }
        /**
         * 예제 끝
         */

        //마지막 결과가 뱃지를 하나도 얻지 못했으면 함수가 잘 실행됐음을 알리는 "SUCCESS" 알려주고
        // 뱃지를 얻은게 있다면 뱃지 이름을 알려준다. 만약 한번에 여러개 얻었다면 마지막에 얻은 뱃지 이름 출력
        return new ResponseEntity<>(gettingBadgeName==null?"SUCCESS":gettingBadgeName, HttpStatus.OK);
    }

    @ApiOperation(value = "뱃지 사용하기", notes = "사용하기가 잘 됐으면 성공 알려줌.")
    @PutMapping("")
    public ResponseEntity<String> usingBadge(@RequestParam int badgeId, @ApiIgnore Authentication authentication){
        //로그인 한 user정보 찾아오는 code
        //스켈레톤 코드 UserController에서 가져옴
        SsafyUserDetails userDetails = (SsafyUserDetails) authentication.getDetails();
        String userEmail = userDetails.getUsername();
        User user = userService.getUserByUserEmail(userEmail);
        Badge badge = badgeService.searchBadge(badgeId);

        BadgeOwn badgeOwn = badgeOwnService.searchBadgeOwn(badgeId, user.getUserId());

        BadgeOwn usingBadge = badgeOwnService.searchMyUsing(user.getUserId());
        if(usingBadge != null){//사용하고 있는 뱃지가 있으면 그거 안사용함으로 바꿔주고 지금 새로 사용하는거 사용으로 해줘야함
            usingBadge.setBadgeOwnIsUsing(false);
            badgeOwnService.modifyBadgeOwn(usingBadge);
        }

        badgeOwn.setBadgeOwnIsUsing(true);
        badgeOwnService.modifyBadgeOwn(badgeOwn);
        return new ResponseEntity<>("SUCCESS", HttpStatus.OK);
    }

}
