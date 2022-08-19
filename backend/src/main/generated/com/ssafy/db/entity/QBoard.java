package com.ssafy.db.entity;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.Generated;
import com.querydsl.core.types.Path;
import com.querydsl.core.types.dsl.PathInits;


/**
 * QBoard is a Querydsl query type for Board
 */
@Generated("com.querydsl.codegen.EntitySerializer")
public class QBoard extends EntityPathBase<Board> {

    private static final long serialVersionUID = 455343204L;

    private static final PathInits INITS = PathInits.DIRECT2;

    public static final QBoard board = new QBoard("board");

    public final StringPath boardContent = createString("boardContent");

    public final DateTimePath<java.util.Date> boardDate = createDateTime("boardDate", java.util.Date.class);

    public final NumberPath<Integer> boardHit = createNumber("boardHit", Integer.class);

    public final NumberPath<Integer> boardId = createNumber("boardId", Integer.class);

    public final NumberPath<Integer> boardLike = createNumber("boardLike", Integer.class);

    public final StringPath boardTitle = createString("boardTitle");

    public final QUser user;

    public QBoard(String variable) {
        this(Board.class, forVariable(variable), INITS);
    }

    public QBoard(Path<? extends Board> path) {
        this(path.getType(), path.getMetadata(), PathInits.getFor(path.getMetadata(), INITS));
    }

    public QBoard(PathMetadata metadata) {
        this(metadata, PathInits.getFor(metadata, INITS));
    }

    public QBoard(PathMetadata metadata, PathInits inits) {
        this(Board.class, metadata, inits);
    }

    public QBoard(Class<? extends Board> type, PathMetadata metadata, PathInits inits) {
        super(type, metadata, inits);
        this.user = inits.isInitialized("user") ? new QUser(forProperty("user"), inits.get("user")) : null;
    }

}

