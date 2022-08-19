package com.ssafy.db.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;

import io.swagger.annotations.ApiModelProperty;
import lombok.*;
import org.hibernate.annotations.DynamicInsert;
import org.hibernate.annotations.DynamicUpdate;

import javax.persistence.*;
//import javax.validation.constraints.Pattern;
//import javax.validation.constraints.Size;
import java.util.Date;

/**
 * 유저 모델 정의.
 */
@Entity
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@DynamicUpdate
@DynamicInsert
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "userId", nullable = false, updatable = false,
            columnDefinition = "INT(11)")
    private Integer userId;

    @Column(name = "userEmail", length = 100, unique = true)
    private String userEmail;

    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    @Column(name = "userPw", length = 200)
    private String userPw;

    @Column(name = "userNickname" )
    private String userNickname;

    @Column(name = "userRuby", columnDefinition = "INT(11) DEFAULT 300")
    private Integer userRuby;

    @ApiModelProperty(value = "금고", example = "금고 제한 루비에 따라 변경")
    @Column(name = "userVault", columnDefinition = "INT(11) DEFAULT 0")
    private Integer userVault;

    @Column(name = "userGuild", columnDefinition = "INT(11)")
    private Integer userGuild;

    @Column(name = "userGameCount", columnDefinition = "INT(11) DEFAULT 0")
    private Integer userGameCount;

    @Column(name = "userWin", columnDefinition = "INT(11) DEFAULT 0")
    private Integer userWin;

    @Column(name = "userGender", nullable = false, length = 1,
            columnDefinition = "CHAR(1) DEFAULT 'M'")
    private String userGender;

    @ApiModelProperty(value = "생성일시")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @Temporal(TemporalType.TIMESTAMP)

    @Column(name = "userCreate", nullable = false, updatable=false, insertable = false,
            columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
    private Date userCreate;

    @ApiModelProperty(value = "최근접속일시")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "userRecent", columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
    private Date userRecent;

    @ApiModelProperty(value = "연속접속일")
    @Column(name = "userRow", columnDefinition = "INT(11) DEFAULT 0")
    private Integer userRow;

    @ApiModelProperty(value =  "0: 유저, 1: 관리자", allowableValues = "0, 1")
    @Column(name = "userType", nullable = false, length = 1,
            columnDefinition = "CHAR(1) DEFAULT '0'")
    private String userType;

    @ApiModelProperty(value = "회원 탈퇴 여부")
    @Column(name = "userIsActive", columnDefinition = "INT(1) DEFAULT 1")//columnDefinition = "boolean DEFAULT true")
    private Integer userIsActive;

    @ManyToOne //객체관계 생성 -> 하나의 티어를 여러 유저가 사용 가능
    @JoinColumn(name="tierId")
    private Tier tier;

}
