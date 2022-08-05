package com.ssafy.db.entity;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.Generated;
import com.querydsl.core.types.Path;
import com.querydsl.core.types.dsl.PathInits;


/**
 * QNoticeboard is a Querydsl query type for Noticeboard
 */
@Generated("com.querydsl.codegen.EntitySerializer")
public class QNoticeboard extends EntityPathBase<Noticeboard> {

    private static final long serialVersionUID = 320099852L;

    private static final PathInits INITS = PathInits.DIRECT2;

    public static final QNoticeboard noticeboard = new QNoticeboard("noticeboard");

    public final StringPath noticeboardContent = createString("noticeboardContent");

    public final DateTimePath<java.util.Date> noticeboardDate = createDateTime("noticeboardDate", java.util.Date.class);

    public final NumberPath<Integer> noticeboardHit = createNumber("noticeboardHit", Integer.class);

    public final NumberPath<Integer> noticeboardId = createNumber("noticeboardId", Integer.class);

    public final StringPath noticeboardTitle = createString("noticeboardTitle");

    public final QUser user;

    public QNoticeboard(String variable) {
        this(Noticeboard.class, forVariable(variable), INITS);
    }

    public QNoticeboard(Path<? extends Noticeboard> path) {
        this(path.getType(), path.getMetadata(), PathInits.getFor(path.getMetadata(), INITS));
    }

    public QNoticeboard(PathMetadata metadata) {
        this(metadata, PathInits.getFor(metadata, INITS));
    }

    public QNoticeboard(PathMetadata metadata, PathInits inits) {
        this(Noticeboard.class, metadata, inits);
    }

    public QNoticeboard(Class<? extends Noticeboard> type, PathMetadata metadata, PathInits inits) {
        super(type, metadata, inits);
        this.user = inits.isInitialized("user") ? new QUser(forProperty("user"), inits.get("user")) : null;
    }

}

