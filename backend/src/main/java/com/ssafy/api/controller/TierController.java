package com.ssafy.api.controller;

import com.ssafy.api.request.TierRegistReq;
import com.ssafy.api.service.TierService;
import com.ssafy.common.auth.SsafyUserDetails;
import com.ssafy.db.entity.GetFriend;
import com.ssafy.db.entity.Tier;
import com.ssafy.db.entity.User;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import springfox.documentation.annotations.ApiIgnore;

@Api(value = "티어 API", tags = {"Tier"})
@RestController
@RequestMapping("/api/tier")
public class TierController {

    @Autowired
    private TierService tierService;

    @ApiOperation(value = "티어 생성", notes = "티어 생성 성공 여부를 보여준다.")
    @PostMapping("")
    public ResponseEntity<String> registTier(@RequestBody @ApiParam(value = "티어 생성 정보", required = true) TierRegistReq tierRegistReq){
        Tier tier = Tier.builder()
                .tierName(tierRegistReq.getTierName())
                .tierImg(tierRegistReq.getTierImg())
                .build();

        tierService.createTier(tier);

        return new ResponseEntity<>("SUCCESS", HttpStatus.OK);
    }

    @ApiOperation(value = "티어 수정", notes = "티어 수정 성공 여부를 보여준다.")
    @PutMapping("")
    public ResponseEntity<String> modifyTier(@RequestBody Tier tier){
        tierService.modifyTier(tier);
        return new ResponseEntity<>("SUCCESS", HttpStatus.OK);
    }

    @ApiOperation(value = "티어 삭제", notes = "티어 삭제 성공 여부를 보여준다.")
    @DeleteMapping("")
    public ResponseEntity<String> deleteTier(@RequestParam int tierId){
        tierService.deleteTier(tierId);

        return new ResponseEntity<>("SUCCESS", HttpStatus.OK);
    }


}
