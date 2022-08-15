package com.ssafy.db.entity;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.Generated;
import com.querydsl.core.types.Path;


/**
 * QRanking is a Querydsl query type for Ranking
 */
@Generated("com.querydsl.codegen.EntitySerializer")
public class QRanking extends EntityPathBase<Ranking> {

    private static final long serialVersionUID = 424309300L;

    public static final QRanking ranking = new QRanking("ranking");

    public final DateTimePath<java.util.Date> rankingDate = createDateTime("rankingDate", java.util.Date.class);

    public final NumberPath<Integer> rankingId = createNumber("rankingId", Integer.class);

    public final NumberPath<Integer> rankingRank = createNumber("rankingRank", Integer.class);

    public final StringPath rankingUserNickname = createString("rankingUserNickname");

    public final NumberPath<Integer> rankingUserRuby = createNumber("rankingUserRuby", Integer.class);

    public final StringPath rankingUserTotal = createString("rankingUserTotal");

    public QRanking(String variable) {
        super(Ranking.class, forVariable(variable));
    }

    public QRanking(Path<? extends Ranking> path) {
        super(path.getType(), path.getMetadata());
    }

    public QRanking(PathMetadata metadata) {
        super(Ranking.class, metadata);
    }

}

