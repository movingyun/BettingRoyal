package com.ssafy.db.entity;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.Generated;
import com.querydsl.core.types.Path;
import com.querydsl.core.types.dsl.PathInits;


/**
 * QVaultLog is a Querydsl query type for VaultLog
 */
@Generated("com.querydsl.codegen.EntitySerializer")
public class QVaultLog extends EntityPathBase<VaultLog> {

    private static final long serialVersionUID = -1148383884L;

    private static final PathInits INITS = PathInits.DIRECT2;

    public static final QVaultLog vaultLog = new QVaultLog("vaultLog");

    public final QUser user;

    public final NumberPath<Integer> userBalance = createNumber("userBalance", Integer.class);

    public final NumberPath<Integer> vaultBalance = createNumber("vaultBalance", Integer.class);

    public final DateTimePath<java.util.Date> vaultLogDate = createDateTime("vaultLogDate", java.util.Date.class);

    public final NumberPath<Integer> vaultLogId = createNumber("vaultLogId", Integer.class);

    public final NumberPath<Integer> vaultMoneyChange = createNumber("vaultMoneyChange", Integer.class);

    public QVaultLog(String variable) {
        this(VaultLog.class, forVariable(variable), INITS);
    }

    public QVaultLog(Path<? extends VaultLog> path) {
        this(path.getType(), path.getMetadata(), PathInits.getFor(path.getMetadata(), INITS));
    }

    public QVaultLog(PathMetadata metadata) {
        this(metadata, PathInits.getFor(metadata, INITS));
    }

    public QVaultLog(PathMetadata metadata, PathInits inits) {
        this(VaultLog.class, metadata, inits);
    }

    public QVaultLog(Class<? extends VaultLog> type, PathMetadata metadata, PathInits inits) {
        super(type, metadata, inits);
        this.user = inits.isInitialized("user") ? new QUser(forProperty("user"), inits.get("user")) : null;
    }

}

