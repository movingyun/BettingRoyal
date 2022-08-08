package com.ssafy.db.repository;

import com.ssafy.db.entity.Board;
import com.ssafy.db.entity.Reply;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.transaction.annotation.Transactional;

public interface ReplyRepository extends JpaRepository<Reply, Integer> {

    @Modifying
    @Transactional
    void deleteByReplyId(Integer replyId);

    Reply findByReplyId(int replyId);

    Boolean existsByBoard(Board boardId);

    @Modifying
    @Transactional
    void deleteByBoard(Board boardId);

}
