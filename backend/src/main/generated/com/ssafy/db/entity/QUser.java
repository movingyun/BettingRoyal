package com.ssafy.db.entity;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.Generated;
import com.querydsl.core.types.Path;
import com.querydsl.core.types.dsl.PathInits;


/**
 * QUser is a Querydsl query type for User
 */
@Generated("com.querydsl.codegen.EntitySerializer")
public class QUser extends EntityPathBase<User> {

    private static final long serialVersionUID = 846542477L;

    private static final PathInits INITS = PathInits.DIRECT2;

    public static final QUser user = new QUser("user");

    public final QTier tier;

    public final DateTimePath<java.util.Date> userCreate = createDateTime("userCreate", java.util.Date.class);

    public final StringPath userEmail = createString("userEmail");

    public final NumberPath<Integer> userGameCount = createNumber("userGameCount", Integer.class);

    public final StringPath userGender = createString("userGender");

    public final NumberPath<Integer> userGuild = createNumber("userGuild", Integer.class);

    public final NumberPath<Integer> userId = createNumber("userId", Integer.class);

    public final NumberPath<Integer> userIsActive = createNumber("userIsActive", Integer.class);

    public final StringPath userNickname = createString("userNickname");

    public final StringPath userPw = createString("userPw");

    public final DateTimePath<java.util.Date> userRecent = createDateTime("userRecent", java.util.Date.class);

    public final NumberPath<Integer> userRow = createNumber("userRow", Integer.class);

    public final NumberPath<Integer> userRuby = createNumber("userRuby", Integer.class);

    public final StringPath userType = createString("userType");

    public final NumberPath<Integer> userVault = createNumber("userVault", Integer.class);

    public final NumberPath<Integer> userWin = createNumber("userWin", Integer.class);

    public QUser(String variable) {
        this(User.class, forVariable(variable), INITS);
    }

    public QUser(Path<? extends User> path) {
        this(path.getType(), path.getMetadata(), PathInits.getFor(path.getMetadata(), INITS));
    }

    public QUser(PathMetadata metadata) {
        this(metadata, PathInits.getFor(metadata, INITS));
    }

    public QUser(PathMetadata metadata, PathInits inits) {
        this(User.class, metadata, inits);
    }

    public QUser(Class<? extends User> type, PathMetadata metadata, PathInits inits) {
        super(type, metadata, inits);
        this.tier = inits.isInitialized("tier") ? new QTier(forProperty("tier")) : null;
    }

}

