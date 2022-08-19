package com.ssafy.api.service;

import com.ssafy.db.entity.Room;
import com.ssafy.db.entity.User;
import com.ssafy.db.repository.RoomRepository;
import org.springframework.beans.factory.annotation.Autowired;
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
        return roomRepository.findAllByRoomIsClose();
    }

    //방 1개조회
    @Transactional(readOnly = true) // select만 하는곳엔 readOnly속성 붙혀줌
    public Room getRoom(int roomId) {
        return roomRepository.findByRoomId(roomId);
    }

    @Transactional(readOnly = true) // select만 하는곳엔 readOnly속성 붙혀줌
    public Room getRoomByName(String roomName) {
        return roomRepository.findByRoomTitle(roomName);
    }

    //방 삭제하기
    @Transactional
    public void deleteByRoomId(int roomId) {
        roomRepository.deleteByRoomId(roomId);
    }

    //방 폭파하기
    @Transactional
    public void closeByRoomId(int roomId) {
        Room room = roomRepository.findByRoomId(roomId);
        room.setRoomIsClose(true);
        roomRepository.save(room);
    }

    //방 게임시작하기
    @Transactional
    public void startByRoomId(int roomId) {
        Room room = roomRepository.findByRoomId(roomId);
        room.setRoomIsStart(true);
        roomRepository.save(room);
    }

    //방 게임끝내기
    @Transactional
    public void finishByRoomId(int roomId) {
        Room room = roomRepository.findByRoomId(roomId);
        room.setRoomIsStart(false);
        roomRepository.save(room);
    }

    @Transactional
    public void addRoomInCnt(int roomId){
        Room room = roomRepository.findByRoomId(roomId);
        room.setRoomInCnt(room.getRoomInCnt()+1);
        roomRepository.save(room);
    }

    @Transactional
    public void minusRoomInCnt(int roomId){
        Room room = roomRepository.findByRoomId(roomId);
        room.setRoomInCnt(room.getRoomInCnt()-1);
        roomRepository.save(room);
    }

}
