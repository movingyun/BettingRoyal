package com.ssafy.api.service;

import com.ssafy.db.entity.Board;
import com.ssafy.db.entity.BoardLike;
import com.ssafy.db.entity.User;
import com.ssafy.db.repository.BoardLikeRepository;
import com.ssafy.db.repository.BoardRepository;
import com.ssafy.db.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
public class BoardLikeService {

    @Autowired
    private BoardLikeRepository boardLikeRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private BoardRepository boardRepository;


    @Transactional
    public void clickBoardLikes(Integer boardId, User user) {
//        boardLikeRepository.boardLikes(boardId, user.getUserId());
        //보드 좋아요 눌러주기
        BoardLike boardLike = BoardLike.builder()
                .board(boardRepository.findByBoardId(boardId))
                .user(user).build();
        boardLikeRepository.save(boardLike);

        //좋아요 수 반영시키기
        Board board = boardRepository.findByBoardId(boardId);
        board.setBoardLike(board.getBoardLike() + 1);
        boardRepository.save(board);
    }


    @Transactional
    public void clickBoardUnLikes(Integer boardId, User user) {
        boardLikeRepository.boardUnLikes(boardId, user.getUserId());

        //좋아요 수 반영시키기
        Board board = boardRepository.findByBoardId(boardId);
        board.setBoardLike(board.getBoardLike() - 1);
        boardRepository.save(board);
    }

    @Transactional
    public boolean checkIsLike(Integer boardId, Integer userId){
        return boardLikeRepository.findIsLike(boardId,userId) != null;
    }
}
