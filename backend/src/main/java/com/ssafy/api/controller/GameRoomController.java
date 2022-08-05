package com.ssafy.api.controller;

import com.ssafy.db.entity.Room;
import com.ssafy.db.repository.RoomRepository;
import com.ssafy.db.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

@Controller
@RequiredArgsConstructor
@RequestMapping(value = "/game")
@Log4j2
public class GameRoomController {

    private final RoomRepository roomRepository;
    private final UserRepository userRepository;
    
    //채팅방 목록 조회
    @GetMapping(value = "/rooms")
    public ModelAndView rooms(){
        log.info("# All game Rooms");
        ModelAndView mv = new ModelAndView("game/rooms");
        mv.addObject("rooms", roomRepository.findAll());
        return mv;
    }
    
    //채팅방 개설
    @PostMapping(value = "/room")
    public String create(@RequestParam(value = "roomTitle") String roomTitle){
        log.info("# Create game Room, name : " + roomTitle);
        Room room = new Room();
        room.setRoomBettingUnit(1);
        room.setRoomId(0);
        room.setRoomIsClose(false);
        room.setRoomIsStart(false);
        room.setRoomTitle(roomTitle);
        room.setUser(userRepository.findById(1).get());
        roomRepository.save(room);
        return "redirect:/game/rooms";
    }

    @GetMapping(value = "/rooms/{roomId}")
    public String getRoom(@PathVariable int roomId, Model model){
        log.info("# get game Room, roomID : " + roomId);
        System.out.println("들어오기테스트");
        model.addAttribute("room", roomRepository.findByRoomId(roomId));
        return "/game/room";
    }
}
