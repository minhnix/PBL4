package com.chat.server.controller;

import com.chat.server.payload.request.ChatMessage;
import com.chat.server.service.MessageService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;
import java.time.LocalDateTime;

@RestController
@RequiredArgsConstructor
@Slf4j
public class ChatController {
    private final MessageService messageService;
    private final SimpMessagingTemplate template;

    @MessageMapping("/chat/pm")
    public void handlePrivateMessage(@Payload ChatMessage chatMessage, Principal principal) {
        log.info("client send chat: {}", chatMessage);
        chatMessage.setCreatedAt(LocalDateTime.now());
        chatMessage.setSender(principal.getName());
        chatMessage.setType(ChatMessage.Type.MESSAGE);

        messageService.saveMessage(chatMessage);
        template.convertAndSendToUser(chatMessage.getSendTo(), "/pm", chatMessage);
    }

    @MessageMapping("/chat/group/{groupId}")
    public void handleGroupMessage(@DestinationVariable String groupId, ChatMessage chatMessage, Principal principal) {
        log.info("client send to group: {}", chatMessage);
        chatMessage.setCreatedAt(LocalDateTime.now());
        chatMessage.setSender(principal.getName());
        chatMessage.setType(ChatMessage.Type.MESSAGE);

        messageService.saveMessage(chatMessage);
        template.convertAndSend("/topic/group/" + groupId, chatMessage);
    }

}
