package com.ssafy.api.controller;

import com.ssafy.api.request.BadgeModifyReq;
import com.ssafy.api.request.BadgeRegistReq;
import com.ssafy.api.service.BadgeService;
import com.ssafy.api.service.MissionService;
import com.ssafy.api.service.UserService;
import com.ssafy.db.entity.Badge;
import com.ssafy.db.entity.Mission;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Api(value = "미션 API", tags = {"Mission"})
@RestController
@RequestMapping("/api/mission")
public class MissionController {

    @Autowired
    private MissionService missionService;

    @ApiOperation(value = "미션 등록", notes = "미션 등록 성공 여부를 보여준다.")
    @PostMapping("")
    public ResponseEntity<String> missionRegist(@RequestParam String missionText){
        Mission mission = Mission.builder()
                .mission(missionText)
                .build();
        missionService.createMission(mission);

        return new ResponseEntity<>("SUCCESS", HttpStatus.OK);
    }

    @ApiOperation(value = "미션 수정", notes = "미션 수정 성공 여부를 보여준다.")
    @PutMapping("")
    public ResponseEntity<String> badgeModify(@RequestBody Mission mission){

        missionService.modifyMission(mission);
        return new ResponseEntity<>("SUCCESS", HttpStatus.OK);
    }

    @ApiOperation(value = "미션 목록", notes = "미션 목록을 받아온다.")
    @GetMapping("")
    public ResponseEntity<List<Mission>> getBadges(){

        return new ResponseEntity<>(missionService.searchAllMission(), HttpStatus.OK);
    }
}
