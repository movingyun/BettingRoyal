package com.ssafy.db.repository;

import org.springframework.stereotype.Repository;

import javax.annotation.PostConstruct;
import java.util.LinkedHashMap;
import java.util.Map;


@Repository
//방의 들어와있는 사람의 수를 세기 위하여 사용
//DB는 건들이지 않고 서버에서만 저장
//Map<Integer roomID, Integer playerCnt> 형식으로 관리
public class RoomSizeRepository {
    private Map<Integer, Integer> roomSizeMap;

    @PostConstruct
    private void init(){
    	roomSizeMap = new LinkedHashMap<>();
    }
    
    //방의 사람 수 구하기
    public int getRoomSize(int roomId) {
    	return roomSizeMap.get(roomId);
    }
    
    //player가 방에 들어오면 지금 플레이어의 수에 +1
    public void plusPlayerCnt(Integer roomId){
    	roomSizeMap.put(roomId, roomSizeMap.getOrDefault(roomId, 0)+1);
    }
    
    //player가 방에서 나가면 지금 플레이어의 수 -1
    public void minusPlayerCnt(Integer roomId){
    	roomSizeMap.put(roomId, roomSizeMap.getOrDefault(roomId, 0)-1);
    }
}
