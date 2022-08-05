package com.ssafy.db.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.*;
import org.hibernate.annotations.DynamicInsert;
import org.hibernate.annotations.DynamicUpdate;

import javax.persistence.*;
import java.util.Date;

/**
 * 길드 게시판 테이블
 */
@Entity
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@DynamicUpdate
@DynamicInsert
public class GuildBoard {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "guildBoardId", nullable = false, updatable = false,
            columnDefinition = "INT(11)")
    private Integer guildBoardId;

    @ManyToOne //객체관계 생성 -> 한 길드는 여러개의 글 작성 가능
    @JoinColumn(name="guildId")
    private Guild guild;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "guildBoardDate", columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
    private Date guildBoardDate;

    @Column(name = "guildBoardTitle", length = 50)
    private String guildBoardTitle;

    @Column(name = "guildBoardContent", columnDefinition = "TEXT")
    private String guildBoardContent;

    @Column(name = "guildBoardHit", columnDefinition = "INT(11)")
    private Integer guildBoardHit;

}
