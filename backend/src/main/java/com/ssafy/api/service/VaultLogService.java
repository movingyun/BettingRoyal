package com.ssafy.api.service;

import com.ssafy.db.entity.User;
import com.ssafy.db.entity.VaultLog;
import com.ssafy.db.repository.VaultLogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class VaultLogService {

    @Autowired
    private VaultLogRepository vaultLogRepository;

    @Transactional
    public void writeVaultLog(VaultLog vaultLog, User user){
        vaultLog.setUser(user);
        vaultLogRepository.save(vaultLog);
    }

}
