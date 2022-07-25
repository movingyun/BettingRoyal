package com.ssafy.api.controller;

import com.ssafy.api.response.UserRes;
import com.ssafy.api.service.RoomService;
import com.ssafy.api.service.UserService;
import com.ssafy.common.auth.SsafyUserDetails;
import com.ssafy.db.entity.Room;
import com.ssafy.db.entity.User;
import com.sun.net.httpserver.Authenticator;
import io.swagger.annotations.Api;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import springfox.documentation.annotations.ApiIgnore;

import java.util.List;

@RestController //RESTFull Controller 개발
@Api(value = "Room API", tags = {"Room"}) //Swagger에 이름 변경(기본값:room-controller)
public class RoomController {

    @Autowired
    private RoomService roomService;

    @Autowired
    UserService userService;

    //방 만들기
    @PostMapping("/api/room")
    public ResponseEntity<String> createRoom(@RequestBody Room room, @ApiIgnore Authentication authentication) {

        //로그인 한 user 찾아오는 code
        //스켈레톤 코드 UserController에서 가져옴
        SsafyUserDetails userDetails = (SsafyUserDetails)authentication.getDetails();
        String userId = userDetails.getUsername();
        User user = userService.getUserByUserId(userId);

        roomService.createRoom(room, user);
        return new ResponseEntity<String>("SUCCESS", HttpStatus.OK);
    }

    //방 전체조회
    @GetMapping("/api/room")
    //한페이지에 6개씩 최근것(id desc정렬)부터 보여준다.
//    public ResponseEntity<Page<Room>> getRoomList(@PageableDefault(size = 6,sort = "id",direction = org.springframework.data.domain.Sort.Direction.DESC) Pageable pageable) {
//        return new ResponseEntity<Page<Room>>(roomService.getRoomList(pageable), HttpStatus.OK);
//    }
        public ResponseEntity<List<Room>> getRoomList() {
        return new ResponseEntity<List<Room>>(roomService.getRoomList(), HttpStatus.OK);
    }





}