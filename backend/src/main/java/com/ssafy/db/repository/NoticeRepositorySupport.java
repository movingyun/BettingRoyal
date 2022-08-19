package com.ssafy.db.repository;

import com.querydsl.jpa.impl.JPAQueryFactory;
import com.ssafy.db.entity.Noticeboard;
import com.ssafy.db.entity.QNoticeboard;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public class NoticeRepositorySupport {
    @Autowired
    private JPAQueryFactory jpaQueryFactory;
    QNoticeboard qNoticeboard = QNoticeboard.noticeboard;

    public Optional<Noticeboard> findByNoticeboardId(Integer noticeId) {
        Noticeboard notice = jpaQueryFactory
                .select(qNoticeboard)
                .from(qNoticeboard)
                .where(qNoticeboard.noticeboardId.eq(noticeId))
                .fetchOne();
        return Optional.ofNullable(notice);
    }
}
