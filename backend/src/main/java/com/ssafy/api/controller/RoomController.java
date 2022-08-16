package com.ssafy.api.controller;

import com.ssafy.api.response.RoomRes;
import com.ssafy.api.service.RoomService;
import com.ssafy.api.service.UserService;
import com.ssafy.common.auth.SsafyUserDetails;
import com.ssafy.db.entity.Room;
import com.ssafy.db.entity.User;
import com.ssafy.api.request.RoomReq;
import io.swagger.annotations.Api;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import springfox.documentation.annotations.ApiIgnore;
import org.springframework.web.bind.annotation.CrossOrigin;

import java.util.ArrayList;
import java.util.List;

@RestController //RESTFull Controller 개발
@Api(value = "Room API", tags = {"Room"}) //Swagger에 이름 변경(기본값:room-controller)
@CrossOrigin(origins = "*")
public class RoomController {

    @Autowired
    private RoomService roomService;

    @Autowired
    UserService userService;

    //방 만들기
    @PostMapping("/api/room")
    public ResponseEntity<Room> createRoom(@RequestBody RoomReq roomreq, @ApiIgnore Authentication authentication) {

        //로그인 한 user정보 찾아오는 code
        //스켈레톤 코드 UserController에서 가져옴
        SsafyUserDetails userDetails = (SsafyUserDetails) authentication.getDetails();
        String userId = userDetails.getUsername();
        User user = userService.getUserByUserEmail(userId);
        Room room= Room.builder()
                        .roomTitle(roomreq.getRoomTitle())
                                .roomBettingUnit(roomreq.getRoomBettingUnit())
                                        .build();
        roomService.createRoom(room, user);
        Room roommade = roomService.getRoomByName(roomreq.getRoomTitle());
        return new ResponseEntity<Room>(roommade, HttpStatus.OK);
    }

    //방 전체조회
    @GetMapping("/api/room")
    public ResponseEntity<List<RoomRes>> getRoomList() {
        List<Room> rooms = roomService.getRoomList();
        List<RoomRes> resList = new ArrayList<>();
        for(Room room : rooms){
            RoomRes res = new RoomRes();
            res.setId(room.getRoomId());
            res.setRoomTitle(room.getRoomTitle());
            res.setRoomPw(room.getRoomPw());
            res.setRoomInCnt(room.getRoomInCnt());
            res.setRoomIsStart(room.isRoomIsStart());
            res.setRoomIsClose(room.isRoomIsClose());
            res.setRoomBettingUnit(room.getRoomBettingUnit());
            resList.add(res);
        }

        return new ResponseEntity<List<RoomRes>>(resList, HttpStatus.OK);
    }

    //방 1개 조회
    @GetMapping("/api/room/{roomId}")
    public ResponseEntity<Room> getRoom(@PathVariable int roomId) {
        return new ResponseEntity<Room>(roomService.getRoom(roomId), HttpStatus.OK);
    }

    //방이름으로 조회
//    @GetMapping("/api/room/{roomName}")
//    public ResponseEntity<Room> getRoomByName(@PathVariable String roomName) {
//        return new ResponseEntity<Room>(roomService.getRoomByName(roomName), HttpStatus.OK);
//    }

    //방 제거하기
    @DeleteMapping("/api/room/{roomId}")
    public ResponseEntity<String> deleteByRoomId(@PathVariable int roomId){
        roomService.deleteByRoomId(roomId);
        return new ResponseEntity<String>("SUCCESS", HttpStatus.OK);
    }
}