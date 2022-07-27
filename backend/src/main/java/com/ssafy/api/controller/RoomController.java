package com.ssafy.api.controller;

import com.ssafy.api.service.RoomService;
import com.ssafy.api.service.UserService;
import com.ssafy.common.auth.SsafyUserDetails;
import com.ssafy.db.entity.Room;
import com.ssafy.db.entity.User;
import io.swagger.annotations.Api;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import springfox.documentation.annotations.ApiIgnore;

import java.util.List;

@RestController //RESTFull Controller 개발
@Api(value = "Room API", tags = {"Room"}) //Swagger에 이름 변경(기본값:room-controller)
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class RoomController {

    @Autowired
    private RoomService roomService;

    @Autowired
    UserService userService;

    //방 만들기
    @PostMapping("/api/room")
    public ResponseEntity<String> createRoom(@RequestBody Room room, @ApiIgnore Authentication authentication) {

        //로그인 한 user정보 찾아오는 code
        //스켈레톤 코드 UserController에서 가져옴
        SsafyUserDetails userDetails = (SsafyUserDetails) authentication.getDetails();
        String userId = userDetails.getUsername();
        User user = userService.getUserByUserId(userId);
        roomService.createRoom(room, user);

        return new ResponseEntity<String>("SUCCESS", HttpStatus.OK);
    }

    //방 전체조회
    @GetMapping("/api/room")
    public ResponseEntity<List<Room>> getRoomList() {
        return new ResponseEntity<List<Room>>(roomService.getRoomList(), HttpStatus.OK);
    }

    //방 1개 조회
    @GetMapping("/api/room/{roomId}")
    public ResponseEntity<Room> getRoom(@PathVariable int roomId) {
        return new ResponseEntity<Room>(roomService.getRoom(roomId), HttpStatus.OK);
    }

    //방 제거하기
    @DeleteMapping("/api/room/{roomId}")
    public ResponseEntity<String> deleteByRoomId(@PathVariable int roomId){
        roomService.deleteByRoomId(roomId);
        return new ResponseEntity<String>("SUCCESS", HttpStatus.OK);
    }
}