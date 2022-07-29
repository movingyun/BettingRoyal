package com.ssafy.db.entity;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.Generated;
import com.querydsl.core.types.Path;


/**
 * QUser is a Querydsl query type for User
 */
@Generated("com.querydsl.codegen.EntitySerializer")
public class QUser extends EntityPathBase<User> {

    private static final long serialVersionUID = 846542477L;

    public static final QUser user = new QUser("user");

    public final DateTimePath<java.util.Date> userCreate = createDateTime("userCreate", java.util.Date.class);

    public final StringPath userEmail = createString("userEmail");

    public final NumberPath<Integer> userGameCount = createNumber("userGameCount", Integer.class);

    public final StringPath userGender = createString("userGender");

    public final NumberPath<Integer> userGuild = createNumber("userGuild", Integer.class);

    public final NumberPath<Integer> userId = createNumber("userId", Integer.class);

    public final BooleanPath userIsActive = createBoolean("userIsActive");

    public final StringPath userNickname = createString("userNickname");

    public final StringPath userPw = createString("userPw");

    public final DateTimePath<java.util.Date> userRecent = createDateTime("userRecent", java.util.Date.class);

    public final NumberPath<Integer> userRow = createNumber("userRow", Integer.class);

    public final NumberPath<Integer> userRuby = createNumber("userRuby", Integer.class);

    public final StringPath userType = createString("userType");

    public final NumberPath<Integer> userVault = createNumber("userVault", Integer.class);

    public final NumberPath<Integer> userWin = createNumber("userWin", Integer.class);

    public QUser(String variable) {
        super(User.class, forVariable(variable));
    }

    public QUser(Path<? extends User> path) {
        super(path.getType(), path.getMetadata());
    }

    public QUser(PathMetadata metadata) {
        super(User.class, metadata);
    }

}

