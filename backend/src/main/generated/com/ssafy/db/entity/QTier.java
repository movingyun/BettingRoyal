package com.ssafy.db.entity;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.Generated;
import com.querydsl.core.types.Path;


/**
 * QTier is a Querydsl query type for Tier
 */
@Generated("com.querydsl.codegen.EntitySerializer")
public class QTier extends EntityPathBase<Tier> {

    private static final long serialVersionUID = 846503076L;

    public static final QTier tier = new QTier("tier");

    public final NumberPath<Integer> tierId = createNumber("tierId", Integer.class);

    public final StringPath tierImg = createString("tierImg");

    public final StringPath tierName = createString("tierName");

    public QTier(String variable) {
        super(Tier.class, forVariable(variable));
    }

    public QTier(Path<? extends Tier> path) {
        super(path.getType(), path.getMetadata());
    }

    public QTier(PathMetadata metadata) {
        super(Tier.class, metadata);
    }

}

