package com.ssafy.db.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.*;
import org.hibernate.annotations.DynamicInsert;
import org.hibernate.annotations.DynamicUpdate;

import javax.persistence.*;
import java.util.Date;

/**
 * 신고 테이블
 */
@Entity
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@DynamicUpdate
@DynamicInsert
public class Report {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "reportId", nullable = false, updatable = false,
            columnDefinition = "INT(11)")
    private Integer reportId;

    @ManyToOne //객체관계 생성 -> 한명의 유저는 여러개의 신고 가능
    @JoinColumn(name="reportUserId")
    private User user;

    @Column(name = "reportBlackUserId", columnDefinition = "INT(11)")
    private Integer reportBlackUserId;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "reportDate", columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
    private Date reportDate;

    @Column(name = "reportReason", columnDefinition = "TEXT")
    private String reportReason;

    @Column(name = "reportResult", columnDefinition = "TEXT")
    private String reportResult;
}
