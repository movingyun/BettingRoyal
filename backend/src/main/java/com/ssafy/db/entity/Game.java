package com.ssafy.db.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.*;
import org.hibernate.annotations.DynamicInsert;
import org.hibernate.annotations.DynamicUpdate;

import javax.persistence.*;
import java.util.Date;

/**
 * 게임 테이블
 */
@Entity
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@DynamicUpdate
@DynamicInsert
public class Game {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "gameId", nullable = false, updatable = false,
            columnDefinition = "INT(11)")
    private Integer gameId;

    @ManyToOne //객체관계 생성 -> 하나의 방에서 여러 게임이 가능함
    @JoinColumn(name="roomId")
    private Room room;

    @ManyToOne //객체관계 생성 -> 하나의 미션은 여러 게임에서 사용할 수 있음
    @JoinColumn(name="missionId")
    private Mission mission;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "gameDate", columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
    private Date gameDate;

    @Column(name = "gameWinner", columnDefinition = "INT(11)")
    private Integer gameWinner;

    @Column(name = "gameReplayUrl", length = 200)
    private String gameReplayUrl;

    @Column(name = "gameGroundCart1", columnDefinition = "INT(11)")
    private Integer gameGroundCart1;

    @Column(name = "gameGroundCart2", columnDefinition = "INT(11)")
    private Integer gameGroundCart2;

    @Column(name = "gameMission", columnDefinition = "TEXT")
    private String gameMission;

}
