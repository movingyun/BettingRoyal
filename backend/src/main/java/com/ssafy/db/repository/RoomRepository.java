package com.ssafy.db.repository;

import com.ssafy.db.entity.Room;
import org.springframework.data.jpa.repository.JpaRepository;

//Service(CRUD) 역할을 한다.
//자동으로 bean등록이 된다.(=@Repositoy 생략 가능)
//Room테이블 관리하는 레퍼지토린데 Room테이블의 PK는 Integer형식이다.
public interface RoomRepository extends JpaRepository<Room, Integer> {
    Room findByRoomId(int roomId);
    void deleteByRoomId(int roomId);
}
