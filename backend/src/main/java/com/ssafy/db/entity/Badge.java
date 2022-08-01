package com.ssafy.db.entity;

import lombok.*;
import org.hibernate.annotations.DynamicInsert;
import org.hibernate.annotations.DynamicUpdate;

import javax.persistence.*;

/**
 * 뱃지 테이블
 */
@Entity
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@DynamicUpdate
@DynamicInsert
public class Badge {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "badgeId", nullable = false, updatable = false,
            columnDefinition = "INT(11)")
    private Integer badgeId;

    @Column(name = "badgeName", length = 50)
    private String badgeName;

    @Column(name = "badgeImg", length = 100)
    private String badgeImg;

    @Column(name = "badgeCondition", columnDefinition = "TEXT")
    private String badgeCondition;


}
