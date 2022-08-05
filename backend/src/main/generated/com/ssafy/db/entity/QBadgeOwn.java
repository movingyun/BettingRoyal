package com.ssafy.db.entity;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.Generated;
import com.querydsl.core.types.Path;
import com.querydsl.core.types.dsl.PathInits;


/**
 * QBadgeOwn is a Querydsl query type for BadgeOwn
 */
@Generated("com.querydsl.codegen.EntitySerializer")
public class QBadgeOwn extends EntityPathBase<BadgeOwn> {

    private static final long serialVersionUID = -2136609115L;

    private static final PathInits INITS = PathInits.DIRECT2;

    public static final QBadgeOwn badgeOwn = new QBadgeOwn("badgeOwn");

    public final QBadge badge;

    public final DateTimePath<java.util.Date> badgeOwnDate = createDateTime("badgeOwnDate", java.util.Date.class);

    public final NumberPath<Integer> badgeOwnId = createNumber("badgeOwnId", Integer.class);

    public final BooleanPath badgeOwnIsUsing = createBoolean("badgeOwnIsUsing");

    public final QUser user;

    public QBadgeOwn(String variable) {
        this(BadgeOwn.class, forVariable(variable), INITS);
    }

    public QBadgeOwn(Path<? extends BadgeOwn> path) {
        this(path.getType(), path.getMetadata(), PathInits.getFor(path.getMetadata(), INITS));
    }

    public QBadgeOwn(PathMetadata metadata) {
        this(metadata, PathInits.getFor(metadata, INITS));
    }

    public QBadgeOwn(PathMetadata metadata, PathInits inits) {
        this(BadgeOwn.class, metadata, inits);
    }

    public QBadgeOwn(Class<? extends BadgeOwn> type, PathMetadata metadata, PathInits inits) {
        super(type, metadata, inits);
        this.badge = inits.isInitialized("badge") ? new QBadge(forProperty("badge")) : null;
        this.user = inits.isInitialized("user") ? new QUser(forProperty("user"), inits.get("user")) : null;
    }

}

