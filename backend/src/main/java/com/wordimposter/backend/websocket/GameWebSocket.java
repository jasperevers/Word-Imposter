package com.wordimposter.backend.websocket;

import org.springframework.messaging.handler.annotation.*;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
public class GameWebSocket {

    private final SimpMessagingTemplate template;

    public GameWebSocket(SimpMessagingTemplate template) {
        this.template = template;
    }

    @MessageMapping("/send")
    public void sendMessage(String message) {
        template.convertAndSend("/topic/messages", message);
    }
}
