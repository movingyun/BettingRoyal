package com.ssafy.handler;

import com.ssafy.principal.StompPrincipal;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.server.support.DefaultHandshakeHandler;

import java.security.Principal;
import java.util.Map;
import java.util.UUID;

//웹 소켓의 세션이 연결될 때 실행될 수 있는 고유한 UUID를 생성해주는 핸들러를 만들자
public class CustomHandshakeHandler extends DefaultHandshakeHandler {
	@Override
	protected Principal determineUser(ServerHttpRequest request, WebSocketHandler wsHandler,
			Map<String, Object> attributes) {
		//토큰따오는거
		return new StompPrincipal(UUID.randomUUID().toString());
	}
}