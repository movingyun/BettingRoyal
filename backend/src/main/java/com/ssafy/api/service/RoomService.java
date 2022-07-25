package com.ssafy.api.service;

import com.ssafy.db.entity.Room;
import com.ssafy.db.entity.User;
import com.ssafy.db.repository.RoomRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class RoomService {
    @Autowired
    private RoomRepository roomRepository;

    //방 생성하기
    @Transactional
    public void createRoom(Room room, User user) {// title content 받아옴
        room.setUser(user);
        roomRepository.save(room);
    }

    //방 전체조회
    @Transactional(readOnly = true) // select만 하는곳엔 readOnly속성 붙혀줌
    public List<Room> getRoomList() {
        return roomRepository.findAll();
    }

}
