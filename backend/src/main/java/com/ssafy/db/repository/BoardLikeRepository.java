package com.ssafy.db.repository;

import com.ssafy.db.entity.Board;
import com.ssafy.db.entity.BoardLike;
import com.ssafy.db.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface BoardLikeRepository extends JpaRepository<BoardLike, Integer> {

    BoardLike findBoardLikeByBoardAndUser(Board board, User user);

    @Modifying
    @Query(value = "INSERT INTO board_like(board_id, user_id) VALUES(:boardId, :userId)", nativeQuery = true)
    void boardLikes(Integer boardId, Optional<User> userId);

    @Modifying
    @Query(value = "DELETE FROM board_like WHERE board_id = :boardId AND user_id = :userId", nativeQuery = true)
    void boardUnLikes(Integer boardId, Optional<User> userId);
}
