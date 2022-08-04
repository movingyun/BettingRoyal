package com.ssafy.api.service;

import com.ssafy.db.entity.User;
import com.ssafy.db.repository.BoardLikeRepository;
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


    @Transactional
    public void clickBoardLikes(Integer boardId, String userEmail) {
        Optional<User> user = userRepository.findByUserEmail(userEmail);
        boardLikeRepository.boardLikes(boardId, user);
    }

    @Transactional
    public void clickBoardUnLikes(Integer boardId, String userEmail) {
        Optional<User> user = userRepository.findByUserEmail(userEmail);
        boardLikeRepository.boardUnLikes(boardId, user);
    }
}
