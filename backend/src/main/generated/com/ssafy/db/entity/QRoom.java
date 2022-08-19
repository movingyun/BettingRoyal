package com.ssafy.db.entity;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.Generated;
import com.querydsl.core.types.Path;
import com.querydsl.core.types.dsl.PathInits;


/**
 * QRoom is a Querydsl query type for Room
 */
@Generated("com.querydsl.codegen.EntitySerializer")
public class QRoom extends EntityPathBase<Room> {

    private static final long serialVersionUID = 846449565L;

    private static final PathInits INITS = PathInits.DIRECT2;

    public static final QRoom room = new QRoom("room");

    public final NumberPath<Integer> roomBettingUnit = createNumber("roomBettingUnit", Integer.class);

    public final NumberPath<Integer> roomId = createNumber("roomId", Integer.class);

    public final NumberPath<Integer> roomInCnt = createNumber("roomInCnt", Integer.class);

    public final BooleanPath roomIsClose = createBoolean("roomIsClose");

    public final BooleanPath roomIsStart = createBoolean("roomIsStart");

    public final NumberPath<Integer> roomPw = createNumber("roomPw", Integer.class);

    public final StringPath roomTitle = createString("roomTitle");

    public final QUser user;

    public QRoom(String variable) {
        this(Room.class, forVariable(variable), INITS);
    }

    public QRoom(Path<? extends Room> path) {
        this(path.getType(), path.getMetadata(), PathInits.getFor(path.getMetadata(), INITS));
    }

    public QRoom(PathMetadata metadata) {
        this(metadata, PathInits.getFor(metadata, INITS));
    }

    public QRoom(PathMetadata metadata, PathInits inits) {
        this(Room.class, metadata, inits);
    }

    public QRoom(Class<? extends Room> type, PathMetadata metadata, PathInits inits) {
        super(type, metadata, inits);
        this.user = inits.isInitialized("user") ? new QUser(forProperty("user"), inits.get("user")) : null;
    }

}

