package com.ssafy.db.repository;

import com.ssafy.db.entity.GetFriend;
import com.ssafy.db.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

//Service(CRUD) 역할을 한다.
//자동으로 bean등록이 된다.(=@Repositoy 생략 가능)
//GetFriend 테이블 관리하는 레퍼지토린데 GetFriend 테이블의 PK는 Integer형식이다.
public interface GetFriendRepository extends JpaRepository<GetFriend, Integer> {
    /**
     * 친구 목록 찾기
     * @return GetFriend 테이블에서 내가 신청하거나 신청 받은 것 중에 수락한 값들을 가져온다.
     */
    @Query(value = "SELECT T.user_id FROM " +
            "(SELECT get_friend_to_user_id user_id FROM get_friend WHERE user_id=? AND get_friend_is_accept is true " +
            "union " +
            "SELECT user_id user_id FROM get_friend WHERE get_friend_to_user_id=? AND get_friend_is_accept is true) T",
            nativeQuery = true)
    List<Integer> findFriends(int userId, int getFriendToUserId);

    /**
     * 내가 받은 친구 요청중에 아직 수락하지 않은 요청들 찾기
     * @param getFriendToUserId 내 아이디
     * @return GetFriend 테이블에서 내가 친구요청을 받았는데 아직 수락 안한 목록을 가져온다.
     */
    List<GetFriend> findByGetFriendToUserIdAndGetFriendIsAcceptFalse(int getFriendToUserId);

    GetFriend findByGetFriendId(int getFriendId);

    @Modifying
    @Transactional
    @Query(value = "DELETE FROM get_friend WHERE user_id=? " +
            "AND get_friend_to_user_id=? AND get_friend_is_accept IS false", nativeQuery = true)
    void deleteByUserAndRqeUser(int userId, int getFriendToUserId);

    @Modifying
    @Transactional
    @Query(value = "DELETE FROM get_friend WHERE user_id=? " +
            "AND get_friend_to_user_id=? AND get_friend_is_accept IS true", nativeQuery = true)
    void deleteByFriend(int userId, int getFriendToUserId);
}
