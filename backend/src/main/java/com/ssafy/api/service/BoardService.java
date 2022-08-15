package com.ssafy.api.service;

import com.ssafy.api.request.BoardPostReq;
import com.ssafy.api.request.BoardUpdateReq;
import com.ssafy.db.entity.Board;
import com.ssafy.db.entity.Noticeboard;
import com.ssafy.db.entity.User;
import com.ssafy.db.repository.BoardRepository;
import com.ssafy.db.repository.BoardRepositorySupport;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class BoardService {

    @Autowired
    private BoardRepository boardRepository;
    @Autowired
    private BoardRepositorySupport boardRepositorySupport;

    @Transactional // 게시판 등록
    public Board createBoard(BoardPostReq boardPostReq, User user ) {
        Board board = new Board();
        board.setUser(user);
        board.setBoardTitle(boardPostReq.getBoardTitle());
        board.setBoardContent(boardPostReq.getBoardContent());
        boardRepository.save(board);
        return board;
    }

    @Transactional // 게시판 수정
    public Board updateBoard(BoardUpdateReq boardUpdateReq, User user) {
        Board board = boardRepositorySupport.findByBoardId(boardUpdateReq.getBoardId()).get();
        board.setUser(user);
        board.setBoardTitle(boardUpdateReq.getBoardTitle());
        board.setBoardContent(boardUpdateReq.getBoardContent());
        boardRepository.save(board);
        return board;
    }

    @Transactional // 게시판 삭제
    public void deleteBoard( Integer boardId ){
    boardRepository.deleteBoardByBoardIdAndUserId( boardId );
    }

    @Transactional // 게시판 조회
    public Board findByBoardId ( Integer boardId ) {
        Board board = boardRepositorySupport.findByBoardId(boardId).get();
        board.setBoardHit(board.getBoardHit()+1);
        boardRepository.save(board);
        return board;
    }

    public List<Board> boardList(){
        return boardRepository.findAll();
    }

}
