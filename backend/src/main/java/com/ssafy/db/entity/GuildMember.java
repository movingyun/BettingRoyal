package com.ssafy.db.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.*;
import org.hibernate.annotations.DynamicInsert;
import org.hibernate.annotations.DynamicUpdate;

import javax.persistence.*;
import java.util.Date;

/**
 * 길드원 테이블
 */
@Entity
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@DynamicUpdate
@DynamicInsert
public class GuildMember {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "guildMemberId", nullable = false, updatable = false,
            columnDefinition = "INT(11)")
    private Integer guildMemberId;

    @ManyToOne //객체관계 생성 -> 한 길드는 여러명의 유저를 받을 수 있음
    @JoinColumn(name="guildId")
    private Guild guild;
    
    @ManyToOne //객체관계 생성 -> 하나의 유저는 하나의 길드만 가입할 수 있지만 가입 기록이 남아서 탈퇴 후 다른길드 가입하면 여러개 남게됨
    @JoinColumn(name="userId")
    private User user;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "guildMemberJoinDate", columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
    private Date guildMemberJoinDate;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "guildMemberExitDate", columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
    private Date guildMemberExitDate;

    @Column(name = "guildMemberIsActive", columnDefinition = "boolean DEFAULT true")//길드 가입 직후는 탈퇴하기 전까지는 활동상태임
    private Boolean guildMemberIsActive;

}
