package com.ssafy.db.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.*;
import org.hibernate.annotations.DynamicInsert;
import org.hibernate.annotations.DynamicUpdate;

import javax.persistence.*;
import java.util.Date;

/**
 * 랭킹 테이블
 */
@Entity
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@DynamicUpdate
@DynamicInsert
public class Ranking {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "rankingId", nullable = false, updatable = false,
            columnDefinition = "INT(11)")
    private Integer rankingId;

    @Column(name = "rankingRank", columnDefinition = "INT(11)")
    private Integer rankingRank;

    @Column(name = "rankingUserNickname", length = 100)
    private String rankingUserNickname;

    @Column(name = "rankingUserRuby", columnDefinition = "INT(11)")
    private Integer rankingUserRuby;

    @Column(name = "rankingUserTotal", length = 100)
    private String rankingUserTotal;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "rankingDate", columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
    private Date rankingDate;

}
