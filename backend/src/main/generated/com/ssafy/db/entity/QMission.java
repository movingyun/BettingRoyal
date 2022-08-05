package com.ssafy.db.entity;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.Generated;
import com.querydsl.core.types.Path;


/**
 * QMission is a Querydsl query type for Mission
 */
@Generated("com.querydsl.codegen.EntitySerializer")
public class QMission extends EntityPathBase<Mission> {

    private static final long serialVersionUID = 515647370L;

    public static final QMission mission1 = new QMission("mission1");

    public final StringPath mission = createString("mission");

    public final NumberPath<Integer> missionId = createNumber("missionId", Integer.class);

    public QMission(String variable) {
        super(Mission.class, forVariable(variable));
    }

    public QMission(Path<? extends Mission> path) {
        super(path.getType(), path.getMetadata());
    }

    public QMission(PathMetadata metadata) {
        super(Mission.class, metadata);
    }

}

