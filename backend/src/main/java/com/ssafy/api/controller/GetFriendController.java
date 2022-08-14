package com.ssafy.api.controller;

import com.ssafy.api.response.FriendListRes;
import com.ssafy.api.response.GetFriendReqRes;
import com.ssafy.api.service.GetFriendService;
import com.ssafy.api.service.UserService;
import com.ssafy.common.auth.SsafyUserDetails;
import com.ssafy.db.entity.GetFriend;
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
import java.util.Collections;
import java.util.Comparator;
import java.util.List;

@Api(value = "친구신청 API", tags = {"GetFriend"})
@RestController
@RequestMapping("/api/friends")
public class GetFriendController {

    @Autowired
    private GetFriendService getFriendService;

    @Autowired
    private UserService userService;

    @ApiOperation(value = "친구 신청", notes = "친구 신청 성공 여부를 보여준다.")
    @PostMapping("")
    public ResponseEntity<String> friendRequest(@RequestParam int getFriendToUserId, @ApiIgnore Authentication authentication){
        //로그인 한 user정보 찾아오는 code
        //스켈레톤 코드 UserController에서 가져옴
        SsafyUserDetails userDetails = (SsafyUserDetails) authentication.getDetails();
        String userEmail = userDetails.getUsername();
        User user = userService.getUserByUserEmail(userEmail);

        GetFriend getFriend = GetFriend.builder()
                .user(user)
                .getFriendToUserId(getFriendToUserId)
                .build();
        getFriendService.deleteByUserReq(user.getUserId(), getFriendToUserId);
        getFriendService.friendReq(getFriend);

        return new ResponseEntity<>("SUCCESS", HttpStatus.OK);
    }

    @ApiOperation(value = "친구 신청 받은 목록", notes = "로그인 된 아이디의 친구 신청 받은 목록들을 반환해준다")
    @GetMapping("/request")
    public ResponseEntity<List<GetFriendReqRes>> friendRequestList(@ApiIgnore Authentication authentication){
        //로그인 한 user정보 찾아오는 code
        //스켈레톤 코드 UserController에서 가져옴
        SsafyUserDetails userDetails = (SsafyUserDetails) authentication.getDetails();
        String userEmail = userDetails.getUsername();
        User user = userService.getUserByUserEmail(userEmail);

        List<GetFriend> getFriends = getFriendService.searchAllFriendReq(user.getUserId());
        List<GetFriendReqRes> getFriendReqResList = new ArrayList<>();

        for(GetFriend getFriend : getFriends){
            GetFriendReqRes res = new GetFriendReqRes();
            res.setId(getFriend.getGetFriendId());
            res.setNickname(getFriend.getUser().getUserNickname());
            res.setRuby(getFriend.getUser().getUserRuby());
            res.setFriendId(getFriend.getGetFriendId());
            getFriendReqResList.add(res);
        }
        return new ResponseEntity<>(getFriendReqResList, HttpStatus.OK);
    }

    @ApiOperation(value = "친구 수락", notes = "친구 신청 받은걸 수락한다 친구요청 id를 가지고 와서 해당하는 값의 accept를 바꿔줌")
    @PutMapping("")
    public ResponseEntity<String> requestAccept(@RequestParam int getFriendId, @ApiIgnore Authentication authentication){
        //로그인 한 user정보 찾아오는 code
        //스켈레톤 코드 UserController에서 가져옴
        SsafyUserDetails userDetails = (SsafyUserDetails) authentication.getDetails();
        String userEmail = userDetails.getUsername();
        User user = userService.getUserByUserEmail(userEmail);

        GetFriend getFriend = getFriendService.searchById(getFriendId);
        getFriend.setGetFriendIsAccept(true);
        getFriendService.friendAccept(getFriend);

        return new ResponseEntity<>("SUCCESS", HttpStatus.OK);
    }

    @ApiOperation(value = "친구 목록",
            notes = "로그인 된 계정의 userId를 가지고 친구 목록을 가져와준다 userId를 int list 형태로 가져와서 유저로 바꿔줘야함")
    @GetMapping("")
    public ResponseEntity<List<FriendListRes>> getFriendList(@ApiIgnore Authentication authentication){
        //로그인 한 user정보 찾아오는 code
        //스켈레톤 코드 UserController에서 가져옴
        System.out.println("친구 컨트롤러" + authentication);
        SsafyUserDetails userDetails = (SsafyUserDetails) authentication.getDetails();
        String userEmail = userDetails.getUsername();
        User user = userService.getUserByUserEmail(userEmail);

        //친구목록을 가져오긴 했는데 아직 userId만 있어서 디비에서 유저 객체의 리스트로 받아와야함!
        List<Integer> userIdList = getFriendService.searchMyFriends(user.getUserId());
        //친구목록 유저객체로 만들어서 리턴해줌!!
        List<User> friends = userService.findMyFriends(userIdList);

        List<FriendListRes> friendList = new ArrayList<>();
        for(User friend : friends){
            FriendListRes friendRes = new FriendListRes();
            friendRes.setId(friend.getUserId());
            friendRes.setNickname(friend.getUserNickname());
            friendRes.setRuby(friend.getUserRuby());
            friendRes.setFriendId(friend.getUserId());
            friendList.add(friendRes);
        }
        Collections.sort(friendList);
        return new ResponseEntity<>(friendList, HttpStatus.OK);
    }

    @ApiOperation(value = "친구 삭제",
            notes = "로그인된 유저와 친구인 유저의 아이디를 가져와서 삭제함")
    @DeleteMapping("")
    public ResponseEntity<String> deleteFriend(@RequestParam int getFriendToUserId, @ApiIgnore Authentication authentication){
        //로그인 한 user정보 찾아오는 code
        //스켈레톤 코드 UserController에서 가져옴
        SsafyUserDetails userDetails = (SsafyUserDetails) authentication.getDetails();
        String userEmail = userDetails.getUsername();
        User user = userService.getUserByUserEmail(userEmail);

        getFriendService.deleteFriend(user.getUserId(), getFriendToUserId);
        return new ResponseEntity<>("SUCCESS", HttpStatus.OK);
    }
}
