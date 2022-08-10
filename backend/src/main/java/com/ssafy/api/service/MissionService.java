package com.ssafy.api.service;

import com.ssafy.db.entity.Mission;
import com.ssafy.db.repository.MissionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MissionService {

    @Autowired
    private MissionRepository missionRepository;

    public int searchAllCnt(){
        return missionRepository.getMissionCnt();
    }

    public Mission searchMission(int missionId){
        return missionRepository.findByMissionId(missionId);
    }

    public void createMission(Mission mission){
        missionRepository.save(mission);
    }

    public void modifyMission(Mission mission){
        missionRepository.save(mission);
    }

    public List<Mission> searchAllMission(){
        return missionRepository.findAll();
    }
}
