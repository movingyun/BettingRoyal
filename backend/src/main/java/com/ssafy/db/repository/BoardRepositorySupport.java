package com.ssafy.db.repository;

import com.querydsl.jpa.impl.JPAQueryFactory;
import com.ssafy.db.entity.Board;
import com.ssafy.db.entity.QBoard;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public class BoardRepositorySupport {
    @Autowired
    private JPAQueryFactory jpaQueryFactory;
    QBoard qBoard = QBoard.board;

    public Optional<Board> findByBoardId(Integer boardId) {
        Board board = jpaQueryFactory
                .select(qBoard)
                .from(qBoard)
                .where(qBoard.boardId.eq(boardId))
                .fetchOne();
        return Optional.ofNullable(board);
    }
}
