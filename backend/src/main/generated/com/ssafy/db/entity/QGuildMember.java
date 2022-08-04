package com.ssafy.db.entity;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.Generated;
import com.querydsl.core.types.Path;
import com.querydsl.core.types.dsl.PathInits;


/**
 * QGuildMember is a Querydsl query type for GuildMember
 */
@Generated("com.querydsl.codegen.EntitySerializer")
public class QGuildMember extends EntityPathBase<GuildMember> {

    private static final long serialVersionUID = -1621481621L;

    private static final PathInits INITS = PathInits.DIRECT2;

    public static final QGuildMember guildMember = new QGuildMember("guildMember");

    public final QGuild guild;

    public final DateTimePath<java.util.Date> guildMemberExitDate = createDateTime("guildMemberExitDate", java.util.Date.class);

    public final NumberPath<Integer> guildMemberId = createNumber("guildMemberId", Integer.class);

    public final BooleanPath guildMemberIsActive = createBoolean("guildMemberIsActive");

    public final DateTimePath<java.util.Date> guildMemberJoinDate = createDateTime("guildMemberJoinDate", java.util.Date.class);

    public final QUser user;

    public QGuildMember(String variable) {
        this(GuildMember.class, forVariable(variable), INITS);
    }

    public QGuildMember(Path<? extends GuildMember> path) {
        this(path.getType(), path.getMetadata(), PathInits.getFor(path.getMetadata(), INITS));
    }

    public QGuildMember(PathMetadata metadata) {
        this(metadata, PathInits.getFor(metadata, INITS));
    }

    public QGuildMember(PathMetadata metadata, PathInits inits) {
        this(GuildMember.class, metadata, inits);
    }

    public QGuildMember(Class<? extends GuildMember> type, PathMetadata metadata, PathInits inits) {
        super(type, metadata, inits);
        this.guild = inits.isInitialized("guild") ? new QGuild(forProperty("guild")) : null;
        this.user = inits.isInitialized("user") ? new QUser(forProperty("user"), inits.get("user")) : null;
    }

}

