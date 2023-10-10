package com.chat.server.controller;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class MessengerController {
    @MessageMapping("/ws")
    @SendTo("/topic/messages")
    public String send(String message) {
        return message;
    }

}
