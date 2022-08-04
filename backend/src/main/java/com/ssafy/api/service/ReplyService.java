package com.ssafy.api.service;

import com.ssafy.db.entity.Badge;
import com.ssafy.db.entity.Reply;
import com.ssafy.db.repository.BoardRepository;
import com.ssafy.db.repository.ReplyRepository;
import com.ssafy.db.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ReplyService {

    @Autowired
    private ReplyRepository replyRepository;

    public void createReply(Reply reply) {
        replyRepository.save(reply);
    }

    public void modifyReply(Reply reply) {
        replyRepository.save(reply);
    }

    public void deleteReply(Integer replyId) {
        replyRepository.deleteByReplyId(replyId);
    }

    public Reply searchReply(Integer replyId) {
        return replyRepository.findByReplyId(replyId);
    }

    public List<Reply> searchAllReply() {
        return replyRepository.findAll();
    }

}
