package com.ssafy.db.repository;

import com.ssafy.db.entity.Board;
import org.kurento.client.internal.server.Param;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

public interface BoardRepository extends JpaRepository<Board, Integer> {

    // 공지 ID로 공지 조회
    Optional<Board> findByBoardId(Integer boardId);
    // 유저 ID로 공지 조회
    @Query(value = "select * from user where user_id=?",nativeQuery = true)
    List<Board> findByUserId(@Param("userId") Integer userId);
    // 공지 삭제
    @Modifying
    @Transactional
    @Query(value = "delete from Board where board_id=?",nativeQuery = true)
    void deleteBoardByBoardIdAndUserId( Integer boardId);

    /////////
    Boolean existsByUser(Integer userId);
}
