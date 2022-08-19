package com.ssafy.api.service;

import com.ssafy.db.entity.GetFriend;
import com.ssafy.db.repository.GetFriendRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class GetFriendService {
    @Autowired
    private GetFriendRepository getFriendRepository;

    /**
     * 친구 신청
     * userId에 내 아이디 getFriendToUserId에 상대방 아이디 넣은 GetFriend 객체 보내주면댐
     * @param getFriend
     */
    @Transactional
    public void friendReq(GetFriend getFriend){
        getFriendRepository.save(getFriend);
    }

    /**
     * 친구 요청받은 목록 - 내가 수락해야 되는 친구 요청들
     * 내 아이디 넣으면 아직 수락하지 않은 내가 받은 요청들 쭉 나와서 반환해줌
     */
    @Transactional
    public List<GetFriend> searchAllFriendReq(int userId){
        return getFriendRepository.findByGetFriendToUserIdAndGetFriendIsAcceptFalse(userId);
    }

    /**
     * 친구 수락
     * 수락할 친구 요청 아이디로 해당 요청 찾아서 accept 부분 true로 바꿔주고 GetFriend 객체 넘겨주면 댐
     */
    @Transactional
    public void friendAccept(GetFriend getFriend){
        getFriendRepository.save(getFriend);
    }

    /**
     * ID로 해당 친구 요청 찾기
     * 친구 수락하기위해 해당하는 아이디로 친구 요청 찾아서 GetFriend 객체 넘겨줌
     */
    @Transactional
    public GetFriend searchById(int getFriendId){
        return getFriendRepository.findByGetFriendId(getFriendId);
    }

    /**
     * 수락한 상태의 모든 친구 목록 리턴해줌 userId만 반환해줘서 userId로 user테이블에서 찾아서 닉네임들 가져오면 댐
     */
    @Transactional
    public List<Integer> searchMyFriends(int userId){
        return getFriendRepository.findFriends(userId,userId);
    }

    /**
     * 친구 신청을 했으면 이미 전에 같은 친구 요청이 있으면 수락하지 않은건 삭제하고 새로 바꿔줌
     */
    @Transactional
    public void deleteByUserReq(int userId, int getFriendToUserId){
        getFriendRepository.deleteByUserAndRqeUser(userId,getFriendToUserId);
        getFriendRepository.deleteByUserAndRqeUser(getFriendToUserId, userId);
    }

    @Transactional
    public void deleteFriend(int userId, int getFriendToUserId){
        getFriendRepository.deleteByFriend(userId,getFriendToUserId);
        getFriendRepository.deleteByFriend(getFriendToUserId, userId);
    }
}
