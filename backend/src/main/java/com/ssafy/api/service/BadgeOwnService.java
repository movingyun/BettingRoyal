package com.ssafy.api.service;

import com.ssafy.db.entity.BadgeOwn;
import com.ssafy.db.entity.User;
import com.ssafy.db.repository.BadgeOwnRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BadgeOwnService {

    @Autowired
    private BadgeOwnRepository badgeOwnRepository;

    public void createBadgeOwn(BadgeOwn badgeOwn){
        badgeOwnRepository.save(badgeOwn);
    }

    public void modifyBadgeOwn(BadgeOwn badgeOwn){
        badgeOwnRepository.save(badgeOwn);
    }

    public BadgeOwn searchMyUsing(int userId){
        return badgeOwnRepository.findUsingBadge(userId);
    }

    public BadgeOwn searchBadgeOwn(int badgeId, int userId){
        return badgeOwnRepository.findByBadgeIdAndUserId(badgeId, userId);
    }

    public boolean chekBadge(int badgeId, User user){
        boolean haveBadge=false;
        User player = user;
        BadgeOwn myBadge = badgeOwnRepository.findByBadgeIdAndUserId(badgeId,user.getUserId());
        if(myBadge!=null){
            haveBadge=true;
        }
        return haveBadge;
    }

    public List<BadgeOwn> findMyBadge(User user){
        return badgeOwnRepository.findByuserId(user.getUserId());
    }

}
