package com.ssafy.db.entity;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.Generated;
import com.querydsl.core.types.Path;
import com.querydsl.core.types.dsl.PathInits;


/**
 * QGetFriend is a Querydsl query type for GetFriend
 */
@Generated("com.querydsl.codegen.EntitySerializer")
public class QGetFriend extends EntityPathBase<GetFriend> {

    private static final long serialVersionUID = 801721362L;

    private static final PathInits INITS = PathInits.DIRECT2;

    public static final QGetFriend getFriend = new QGetFriend("getFriend");

    public final DateTimePath<java.util.Date> getFriendDate = createDateTime("getFriendDate", java.util.Date.class);

    public final NumberPath<Integer> getFriendId = createNumber("getFriendId", Integer.class);

    public final BooleanPath getFriendIsAccept = createBoolean("getFriendIsAccept");

    public final NumberPath<Integer> getFriendToUserId = createNumber("getFriendToUserId", Integer.class);

    public final QUser user;

    public QGetFriend(String variable) {
        this(GetFriend.class, forVariable(variable), INITS);
    }

    public QGetFriend(Path<? extends GetFriend> path) {
        this(path.getType(), path.getMetadata(), PathInits.getFor(path.getMetadata(), INITS));
    }

    public QGetFriend(PathMetadata metadata) {
        this(metadata, PathInits.getFor(metadata, INITS));
    }

    public QGetFriend(PathMetadata metadata, PathInits inits) {
        this(GetFriend.class, metadata, inits);
    }

    public QGetFriend(Class<? extends GetFriend> type, PathMetadata metadata, PathInits inits) {
        super(type, metadata, inits);
        this.user = inits.isInitialized("user") ? new QUser(forProperty("user"), inits.get("user")) : null;
    }

}

