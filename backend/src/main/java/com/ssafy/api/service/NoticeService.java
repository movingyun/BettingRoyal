package com.ssafy.api.service;

import com.ssafy.api.request.NoticePostReq;
import com.ssafy.api.request.NoticeUpdateReq;
import com.ssafy.db.entity.Badge;
import com.ssafy.db.entity.Noticeboard;
import com.ssafy.db.entity.User;
import com.ssafy.db.repository.NoticeRepository;
import com.ssafy.db.repository.NoticeRepositorySupport;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class NoticeService {

    @Autowired
    private NoticeRepository noticeRepository;
    @Autowired
    private NoticeRepositorySupport noticeRepositorySupport;

    @Transactional // 공지사항 등록
    public Noticeboard createNotice(NoticePostReq noticePostReq, User user ) {
        Noticeboard noticeboard = new Noticeboard();
        noticeboard.setUser(user);
        noticeboard.setNoticeboardTitle(noticePostReq.getNoticeTitle());
        noticeboard.setNoticeboardContent(noticePostReq.getNoticeContent());
        noticeRepository.save(noticeboard);
        return noticeboard;
    }

    @Transactional // 공지사항 수정
    public Noticeboard updateNotice(NoticeUpdateReq noticeUpdateReq, User user) {
        Noticeboard noticeboard = noticeRepositorySupport.findByNoticeboardId(noticeUpdateReq.getNoticeId()).get();
        noticeboard.setUser(user);
        noticeboard.setNoticeboardTitle(noticeUpdateReq.getNoticeTitle());
        noticeboard.setNoticeboardContent(noticeUpdateReq.getNoticeContent());
        noticeRepository.save(noticeboard);
        return noticeboard;
    }

    @Transactional // 공지사항 삭제
    public void deleteNotice( Integer noticeId ){
    noticeRepository.deleteNoticeboardByNoticeboardIdAndUserId( noticeId );
    }

    @Transactional // 공지사항 조회
    public Noticeboard findByNoticeId ( Integer noticeId ) {
        Noticeboard notice = noticeRepositorySupport.findByNoticeboardId(noticeId).get();
        notice.setNoticeboardHit(notice.getNoticeboardHit() + 1);
        noticeRepository.save(notice);
        return notice;
    }

    public List<Noticeboard> noticeList(){
        return noticeRepository.findAll();
    }

}
