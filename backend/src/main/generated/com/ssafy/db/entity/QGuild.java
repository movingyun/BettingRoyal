package com.ssafy.db.entity;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.Generated;
import com.querydsl.core.types.Path;


/**
 * QGuild is a Querydsl query type for Guild
 */
@Generated("com.querydsl.codegen.EntitySerializer")
public class QGuild extends EntityPathBase<Guild> {

    private static final long serialVersionUID = 460147057L;

    public static final QGuild guild = new QGuild("guild");

    public final StringPath guildContent = createString("guildContent");

    public final DateTimePath<java.util.Date> guildDate = createDateTime("guildDate", java.util.Date.class);

    public final NumberPath<Integer> guildId = createNumber("guildId", Integer.class);

    public final NumberPath<Integer> guildMaxMember = createNumber("guildMaxMember", Integer.class);

    public final StringPath guildName = createString("guildName");

    public final NumberPath<Integer> leaderUserId = createNumber("leaderUserId", Integer.class);

    public QGuild(String variable) {
        super(Guild.class, forVariable(variable));
    }

    public QGuild(Path<? extends Guild> path) {
        super(path.getType(), path.getMetadata());
    }

    public QGuild(PathMetadata metadata) {
        super(Guild.class, metadata);
    }

}

