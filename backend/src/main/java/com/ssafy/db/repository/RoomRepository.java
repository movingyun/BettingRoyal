package com.ssafy.db.repository;

import com.ssafy.db.entity.GameInfo;
import com.ssafy.db.entity.Room;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

//Service(CRUD) 역할을 한다.
//자동으로 bean등록이 된다.(=@Repositoy 생략 가능)
//Room테이블 관리하는 레퍼지토린데 Room테이블의 PK는 Integer형식이다.
public interface RoomRepository extends JpaRepository<Room, Integer> {
    Room findByRoomId(int roomId);

    @Query(value = "SELECT * FROM room WHERE room_is_close=false", nativeQuery = true)
    List<Room> findAllByRoomIsClose();

    Room findByRoomTitle(String roomTitle);

    void deleteByRoomId(int roomId);
}
