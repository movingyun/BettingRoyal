package com.ssafy.db.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.*;
import org.hibernate.annotations.DynamicInsert;
import org.hibernate.annotations.DynamicUpdate;

import javax.persistence.*;
import java.util.Date;

/**
 * 길드 테이블
 */
@Entity
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@DynamicUpdate
@DynamicInsert
public class Guild {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "guildId", nullable = false, updatable = false,
            columnDefinition = "INT(11)")
    private Integer guildId;

    @Column(name = "leaderUserId", nullable = false) //길드에 길드장은 필수!
    private Integer leaderUserId;

    @Column(name = "guildName", length = 50)
    private String guildName;

    @Column(name = "guildMaxMember", columnDefinition = "INT(11)")
    private Integer guildMaxMember;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "guildDate", columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
    private Date guildDate;

    @Column(name = "guildContent", columnDefinition = "TEXT")
    private String guildContent;
}
