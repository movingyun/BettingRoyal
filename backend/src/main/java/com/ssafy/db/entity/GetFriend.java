package com.ssafy.db.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.*;
import org.hibernate.annotations.DynamicInsert;
import org.hibernate.annotations.DynamicUpdate;

import javax.persistence.*;
import java.util.Date;

/**
 * 친구신청 테이블
 */
@Entity
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@DynamicUpdate
@DynamicInsert
public class GetFriend {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "getFriendId", nullable = false, updatable = false,
            columnDefinition = "INT(11)")
    private Integer getFriendId;

    @ManyToOne //객체관계 생성 -> 한명의 유저는 여러명의 친구를 가질 수 있음
    @JoinColumn(name="userId")
    private User user;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "getFriendDate", columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
    private Date getFriendDate;

    @Column(name = "getFriendIsAccept", columnDefinition = "boolean DEFAULT false")//요청 보내면 처음에는 수락 안된 상태!
    private Boolean getFriendIsAccept;

    @Column(name = "getFriendToUserId", columnDefinition = "INT(11)")
    private Integer getFriendToUserId;

}
