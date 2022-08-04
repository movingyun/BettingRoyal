package com.ssafy.db.entity;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.Generated;
import com.querydsl.core.types.Path;
import com.querydsl.core.types.dsl.PathInits;


/**
 * QGameInfo is a Querydsl query type for GameInfo
 */
@Generated("com.querydsl.codegen.EntitySerializer")
public class QGameInfo extends EntityPathBase<GameInfo> {

    private static final long serialVersionUID = -1757481598L;

    private static final PathInits INITS = PathInits.DIRECT2;

    public static final QGameInfo gameInfo = new QGameInfo("gameInfo");

    public final QGame game;

    public final DateTimePath<java.util.Date> gameDate = createDateTime("gameDate", java.util.Date.class);

    public final NumberPath<Integer> gameInfoId = createNumber("gameInfoId", Integer.class);

    public final BooleanPath isWinner = createBoolean("isWinner");

    public final NumberPath<Integer> mycard = createNumber("mycard", Integer.class);

    public final NumberPath<Integer> rubyGet = createNumber("rubyGet", Integer.class);

    public final QUser user;

    public QGameInfo(String variable) {
        this(GameInfo.class, forVariable(variable), INITS);
    }

    public QGameInfo(Path<? extends GameInfo> path) {
        this(path.getType(), path.getMetadata(), PathInits.getFor(path.getMetadata(), INITS));
    }

    public QGameInfo(PathMetadata metadata) {
        this(metadata, PathInits.getFor(metadata, INITS));
    }

    public QGameInfo(PathMetadata metadata, PathInits inits) {
        this(GameInfo.class, metadata, inits);
    }

    public QGameInfo(Class<? extends GameInfo> type, PathMetadata metadata, PathInits inits) {
        super(type, metadata, inits);
        this.game = inits.isInitialized("game") ? new QGame(forProperty("game"), inits.get("game")) : null;
        this.user = inits.isInitialized("user") ? new QUser(forProperty("user"), inits.get("user")) : null;
    }

}

