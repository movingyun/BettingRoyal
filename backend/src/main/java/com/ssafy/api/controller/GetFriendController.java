package com.ssafy.api.controller;

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
    public ResponseEntity<List<GetFriend>> friendRequestList(@ApiIgnore Authentication authentication){
        //로그인 한 user정보 찾아오는 code
        //스켈레톤 코드 UserController에서 가져옴
        SsafyUserDetails userDetails = (SsafyUserDetails) authentication.getDetails();
        String userEmail = userDetails.getUsername();
        User user = userService.getUserByUserEmail(userEmail);

        return new ResponseEntity<>(getFriendService.searchAllFriendReq(user.getUserId()), HttpStatus.OK);
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
    public ResponseEntity<List<User>> getFriendList(@ApiIgnore Authentication authentication){
        //로그인 한 user정보 찾아오는 code
        //스켈레톤 코드 UserController에서 가져옴
        SsafyUserDetails userDetails = (SsafyUserDetails) authentication.getDetails();
        String userEmail = userDetails.getUsername();
        User user = userService.getUserByUserEmail(userEmail);

        //친구목록을 가져오긴 했는데 아직 userId만 있어서 디비에서 유저 객체의 리스트로 받아와야함!
        List<Integer> userIdList = getFriendService.searchMyFriends(user.getUserId());

        return new ResponseEntity<>(userService.findMyFriends(userIdList), HttpStatus.OK);
    }
}
