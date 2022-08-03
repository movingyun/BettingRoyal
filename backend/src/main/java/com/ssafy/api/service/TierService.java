package com.ssafy.api.service;

import com.ssafy.db.entity.Tier;
import com.ssafy.db.repository.TierRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class TierService {

    @Autowired
    private TierRepository tierRepository;

    @Transactional
    public void createTier(Tier tier){
        tierRepository.save(tier);
    }

    @Transactional
    public void modifyTier(Tier tier){
        tierRepository.save(tier);
    }

    @Transactional
    public void deleteTier(int tierId){
        tierRepository.deleteByTierId(tierId);
    }

}
