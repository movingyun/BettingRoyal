package com.ssafy.db.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.*;
import org.hibernate.annotations.DynamicInsert;
import org.hibernate.annotations.DynamicUpdate;

import javax.persistence.*;
import java.util.Date;

/**
 * 뱃지 보유여부 테이블
 */
@Entity
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@DynamicUpdate
@DynamicInsert
public class BadgeOwn {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "badgeOwnId", nullable = false, updatable = false,
            columnDefinition = "INT(11)")
    private Integer badgeOwnId;

    @ManyToOne //객체관계 생성 -> 한명의 유저는 여러개의 뱃지 보유 가능
    @JoinColumn(name="userId")
    private User user;

    @ManyToOne //객체관계 생성 -> 하나의 뱃지는 여러명의 유저가 사용 가능
    @JoinColumn(name="badgeId")
    private Badge badge;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "badgeOwnDate", columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
    private Date badgeOwnDate;

    @Column(name = "", columnDefinition = "boolean DEFAULT false")//뱃지를 보유하게되면 처음에는 사용 안하는 상태!
    private Boolean badgeOwnIsUsing;

}
