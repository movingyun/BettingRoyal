package com.ssafy.db.repository;

import com.ssafy.db.entity.VaultLog;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

//Service(CRUD) 역할을 한다.
//자동으로 bean등록이 된다.(=@Repositoy 생략 가능)
//VaultLog 테이블 관리하는 레퍼지토린데 VaultLog 테이블의 PK는 Integer형식이다.
public interface VaultLogRepository extends JpaRepository<VaultLog, Integer> {
    //로그를 남기기 위해 금고 사용 내역을 저장하는 것이 목적이여서 save만 사용할 것이니 따로 함수를 만들지 않았음.
//    List<VaultLog> findByUserId(Integer userId); 만들지 말지..?
}
