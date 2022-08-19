package com.ssafy.db.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.*;
import org.hibernate.annotations.DynamicInsert;
import org.hibernate.annotations.DynamicUpdate;

import javax.persistence.*;
import java.util.Date;

/**
 * 게시판 테이블
 */
@Entity
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@DynamicUpdate
@DynamicInsert
public class Board {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "boardId", nullable = false, updatable = false,
            columnDefinition = "INT(11)")
    private Integer boardId;

    @ManyToOne //객체관계 생성 -> 한명의 유저는 여러개의 게시글 작성 가능
    @JoinColumn(name="userId")
    private User user;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "boardDate", columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
    private Date boardDate;

    @Column(name = "boardTitle", length = 50)
    private String boardTitle;

    @Column(name = "boardContent", columnDefinition = "TEXT")
    private String boardContent;

    @Column(name = "boardHit", columnDefinition = "INT(11) DEFAULT 0")
    private Integer boardHit;

    @Column(name = "boardLike", columnDefinition = "INT(11) DEFAULT 0")
    private Integer boardLike;


}
