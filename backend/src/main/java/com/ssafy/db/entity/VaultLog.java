package com.ssafy.db.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.*;
import org.hibernate.annotations.DynamicInsert;
import org.hibernate.annotations.DynamicUpdate;

import javax.persistence.*;
import java.util.Date;

/**
 * 금고이력 테이블
 */
@Entity
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@DynamicUpdate
@DynamicInsert
public class VaultLog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "vaultLogId", nullable = false, updatable = false,
            columnDefinition = "INT(11)")
    private Integer vaultLogId;

    @ManyToOne //객체관계 생성 -> 한명의 유저는 금고이력 로그를 여러개 남길 수 있음
    @JoinColumn(name="userId")
    private User user;

    @Column(name = "vaultMoneyChange", columnDefinition = "INT(11)")
    private Integer vaultMoneyChange;

    //현재 금고 자산
    @Column(name = "vaultBalance", columnDefinition = "INT(11)")
    private Integer vaultBalance;

    //현재 유저 자산
    @Column(name = "userBalance", columnDefinition = "INT(11)")
    private Integer userBalance;
    
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "vaultLogDate", columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
    private Date vaultLogDate;

}
