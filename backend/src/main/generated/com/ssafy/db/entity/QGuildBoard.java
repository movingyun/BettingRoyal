package com.ssafy.db.entity;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.Generated;
import com.querydsl.core.types.Path;
import com.querydsl.core.types.dsl.PathInits;


/**
 * QGuildBoard is a Querydsl query type for GuildBoard
 */
@Generated("com.querydsl.codegen.EntitySerializer")
public class QGuildBoard extends EntityPathBase<GuildBoard> {

    private static final long serialVersionUID = 1461842933L;

    private static final PathInits INITS = PathInits.DIRECT2;

    public static final QGuildBoard guildBoard = new QGuildBoard("guildBoard");

    public final QGuild guild;

    public final StringPath guildBoardContent = createString("guildBoardContent");

    public final DateTimePath<java.util.Date> guildBoardDate = createDateTime("guildBoardDate", java.util.Date.class);

    public final NumberPath<Integer> guildBoardHit = createNumber("guildBoardHit", Integer.class);

    public final NumberPath<Integer> guildBoardId = createNumber("guildBoardId", Integer.class);

    public final StringPath guildBoardTitle = createString("guildBoardTitle");

    public QGuildBoard(String variable) {
        this(GuildBoard.class, forVariable(variable), INITS);
    }

    public QGuildBoard(Path<? extends GuildBoard> path) {
        this(path.getType(), path.getMetadata(), PathInits.getFor(path.getMetadata(), INITS));
    }

    public QGuildBoard(PathMetadata metadata) {
        this(metadata, PathInits.getFor(metadata, INITS));
    }

    public QGuildBoard(PathMetadata metadata, PathInits inits) {
        this(GuildBoard.class, metadata, inits);
    }

    public QGuildBoard(Class<? extends GuildBoard> type, PathMetadata metadata, PathInits inits) {
        super(type, metadata, inits);
        this.guild = inits.isInitialized("guild") ? new QGuild(forProperty("guild")) : null;
    }

}

