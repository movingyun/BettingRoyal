package com.ssafy.principal;

import java.security.Principal;

// 웹 소켓 세션 주체의 정보를 담고있는  java.security.principal 객체를 상속한 StompPrincipal 클래스를 만듦
public class StompPrincipal implements Principal {
	public String name;

	public StompPrincipal(String name) {
		this.name = name;
	}

	@Override
	public String getName() {
		return name;
	}
}
