package com.ssafy.api.controller;

import com.ssafy.api.request.BadgeRegistReq;
import com.ssafy.api.response.BadgeOwnRes;
import com.ssafy.api.service.BadgeOwnService;
import com.ssafy.api.service.BadgeService;
import com.ssafy.api.service.UserService;
import com.ssafy.common.auth.SsafyUserDetails;
import com.ssafy.db.entity.Badge;
import com.ssafy.db.entity.BadgeOwn;
import com.ssafy.db.entity.Room;
import com.ssafy.db.entity.User;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import springfox.documentation.annotations.ApiIgnore;

import java.util.ArrayList;
import java.util.List;

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

        //저축왕(500원 이상 저금)
        if(user.getUserVault() > 500){
            //있는지 없는지 체크해봐
            boolean haveBadge = badgeOwnService.chekBadge(1, user);
            if(!haveBadge){
                badgeOwn = BadgeOwn.builder()
                        .badge(badgeService.searchBadge(1))
                        .user(user)
                        .build();
                badgeOwnService.createBadgeOwn(badgeOwn);
            }
        }

        //반백수(총 전적 100판 이상 달성)
        if(user.getUserGameCount() >= 100){
            boolean haveBadge = badgeOwnService.chekBadge(2, user);
            if(!haveBadge){
                badgeOwn = BadgeOwn.builder()
                        .badge(badgeService.searchBadge(2))
                        .user(user)
                        .build();
                badgeOwnService.createBadgeOwn(badgeOwn);
            }
        }

        //갬블러(총 전적 300판 달성)
        if(user.getUserGameCount() >= 300){
            boolean haveBadge = badgeOwnService.chekBadge(3, user);
            if(!haveBadge){
                badgeOwn = BadgeOwn.builder()
                        .badge(badgeService.searchBadge(3))
                        .user(user)
                        .build();
                badgeOwnService.createBadgeOwn(badgeOwn);
            }
        }

        //심리전문가(총 전적 50승 달성)
        if(user.getUserWin() >= 50){
            boolean haveBadge = badgeOwnService.chekBadge(4, user);
            if(!haveBadge){
                badgeOwn = BadgeOwn.builder()
                        .badge(badgeService.searchBadge(4))
                        .user(user)
                        .build();
                badgeOwnService.createBadgeOwn(badgeOwn);
            }
        }

        //멘탈리스트(총 전적 100승 달성)
        if(user.getUserWin() >= 100){
            boolean haveBadge = badgeOwnService.chekBadge(5, user);
            if(!haveBadge){
                badgeOwn = BadgeOwn.builder()
                        .badge(badgeService.searchBadge(5))
                        .user(user)
                        .build();
                badgeOwnService.createBadgeOwn(badgeOwn);
            }
        }
        return new ResponseEntity<>("SUCCESS", HttpStatus.OK);
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

    //뱃지 전체 조회
    @ApiOperation(value = "내가 가진 뱃지", notes = "내가 가지고있는 뱃지 List로 반환")
    @GetMapping("")
    public ResponseEntity<List<BadgeOwnRes>> getBadgeOwnList(@ApiIgnore Authentication authentication) {
        SsafyUserDetails userDetails = (SsafyUserDetails) authentication.getDetails();
        String userEmail = userDetails.getUsername();
        User user = userService.getUserByUserEmail(userEmail);

        List<BadgeOwn> badgeOwns = badgeOwnService.findMyBadge(user);
        List<BadgeOwnRes> resList = new ArrayList<>();
        for(BadgeOwn badgeOwn : badgeOwns){
            BadgeOwnRes res = new BadgeOwnRes();
            res.setBadgeOwnId(badgeOwn.getBadgeOwnId());
            res.setBadge(badgeOwn.getBadge());
            res.setBadgeOwnIsUsing(badgeOwn.getBadgeOwnIsUsing());
            resList.add(res);
        }

        return new ResponseEntity<>(resList, HttpStatus.OK);
    }

    @ApiOperation(value = "내가 가진 뱃지", notes = "내가 가지고있는 뱃지 List로 반환")
    @GetMapping("/my")
    public ResponseEntity<BadgeOwn> getMyBadge(@ApiIgnore Authentication authentication) {
        SsafyUserDetails userDetails = (SsafyUserDetails) authentication.getDetails();
        String userEmail = userDetails.getUsername();
        User user = userService.getUserByUserEmail(userEmail);

        BadgeOwn usingBadge = badgeOwnService.searchMyUsing(user.getUserId());

        return new ResponseEntity<>(usingBadge, HttpStatus.OK);
    }
}
