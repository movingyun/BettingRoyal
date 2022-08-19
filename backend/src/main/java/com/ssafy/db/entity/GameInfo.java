package com.ssafy.db.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.*;
import org.hibernate.annotations.DynamicInsert;
import org.hibernate.annotations.DynamicUpdate;

import javax.persistence.*;
import java.util.Date;

/**
 * 게임결과 테이블
 */
@Entity
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@DynamicUpdate
@DynamicInsert
public class GameInfo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "gameInfoId", nullable = false, updatable = false,
            columnDefinition = "INT(11)")
    private Integer gameInfoId;

    @ManyToOne //객체관계 생성 -> 하나의 게임에서 여러개의 게임 결과가(참여자 수 만큼) 나올 수 있음.
    @JoinColumn(name="gameId")
    private Game game;

    @ManyToOne //객체관계 생성 -> 한명의 유저는 여러개의 게임 결과에 들어갈 수 있음.
    @JoinColumn(name="userId")
    private User user;

    @Column(name = "rubyGet", columnDefinition = "INT(11)")
    private Integer rubyGet;

    @Column(name = "mycard", columnDefinition = "INT(11)")
    private Integer mycard;

    @Column(name = "isWinner", columnDefinition = "boolean DEFAULT false")
    private Boolean isWinner;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "gameDate", columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
    private Date gameDate;

}