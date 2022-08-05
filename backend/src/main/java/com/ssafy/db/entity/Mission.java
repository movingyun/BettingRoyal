package com.ssafy.db.entity;

import lombok.*;
import org.hibernate.annotations.DynamicInsert;
import org.hibernate.annotations.DynamicUpdate;

import javax.persistence.*;

/**
 * 미션(게임플레이어 공통 질문) 테이블
 */
@Entity
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@DynamicUpdate
@DynamicInsert
public class Mission {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "missionId", nullable = false, updatable = false,
            columnDefinition = "INT(11)")
    private Integer missionId;

    @Column(name = "mission", columnDefinition = "TEXT")
    private String mission;


}
