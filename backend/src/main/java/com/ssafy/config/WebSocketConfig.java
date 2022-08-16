package com.ssafy.config;

import com.ssafy.handler.CustomHandshakeHandler;
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@EnableWebSocketMessageBroker //Stomp사용하기 위해서 선언
@Configuration
//Stomp사용 = WebSocketMessageBrokerConfigurer 상속
//WebSocket사용 = WebSocketConfigurer 상속
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
    	//메시지를 구독하는 요청의 prefix는 /sub로 시작하도록 설정
    	config.enableSimpleBroker("/sub");
    	
        //서버에 있는 모든 user가 메시지를 받도록
        //메시지를 발행하는 요청의 prefix는 /pub으로 시작하도록 설정
        config.setApplicationDestinationPrefixes("/pub");
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
    	//stomp websockey의 연결 endpoint는 /stomp-game으로 설정
        registry.addEndpoint("/stomp-game")
                .setAllowedOriginPatterns("*")
                //내가 만든 핸들러 실행할 수 있도록 등록
                .setHandshakeHandler(new CustomHandshakeHandler())
                .withSockJS();
    }

}
