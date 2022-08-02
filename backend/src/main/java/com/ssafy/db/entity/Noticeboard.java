package com.ssafy.db.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.*;
import org.hibernate.annotations.DynamicInsert;
import org.hibernate.annotations.DynamicUpdate;

import javax.persistence.*;
import java.util.Date;

/**
 * 공지사항 테이블
 */
@Entity
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@DynamicUpdate
@DynamicInsert
public class Noticeboard {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "noticeboardId", nullable = false, updatable = false,
            columnDefinition = "INT(11)")
    private Integer noticeboardId;

    @ManyToOne //객체관계 생성 -> 한명의 유저는 여러개의 공지사항 작성 가능
    @JoinColumn(name="userId")
    private User user;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "noticeboardDate", columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
    private Date noticeboardDate;

    @Column(name = "noticeboardTitle", length = 50)
    private String noticeboardTitle;

    @Column(name = "noticeboardContent", columnDefinition = "TEXT")
    private String noticeboardContent;

    @Column(name = "noticeboardHit", columnDefinition = "INT(11) DEFAULT 0")
    private Integer noticeboardHit;


}
