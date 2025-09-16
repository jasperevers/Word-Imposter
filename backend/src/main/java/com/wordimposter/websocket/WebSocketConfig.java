package com.wordimposter.websocket;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;

@Configuration
@EnableWebSocket
public class WebSocketConfig implements WebSocketConfigurer {
    
    private final GameWebSocket gameWebSocket;
    
    public WebSocketConfig(GameWebSocket gameWebSocket) {
        this.gameWebSocket = gameWebSocket;
    }
    
    @Override
    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
        registry.addHandler(gameWebSocket, "/game-ws")
               .setAllowedOrigins("*");
    }
}
