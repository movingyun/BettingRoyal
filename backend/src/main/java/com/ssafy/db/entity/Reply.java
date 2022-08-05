package com.ssafy.db.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.*;
import org.hibernate.annotations.DynamicInsert;
import org.hibernate.annotations.DynamicUpdate;

import javax.persistence.*;
import java.util.Date;

/**
 * 게시판 댓글 테이블
 */
@Entity
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@DynamicUpdate
@DynamicInsert
public class Reply {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "replyId", nullable = false, updatable = false,
            columnDefinition = "INT(11)")
    private Integer replyId;

    @ManyToOne //객체관계 생성 -> 한명의 유저는 여러개의 댓글 작성 가능
    @JoinColumn(name="userId")
    private User user;

    @ManyToOne //객체관계 생성 -> 하나의 게시글에 여러개의 댓글 작성 가능
    @JoinColumn(name = "boardId")
    private Board board;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "replyDate", columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
    private Date replyDate;

    @Column(name = "replyContent", columnDefinition = "TEXT")
    private String replyContent;

}
