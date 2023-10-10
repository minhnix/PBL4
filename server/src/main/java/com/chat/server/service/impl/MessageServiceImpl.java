package com.chat.server.service.impl;

import com.chat.server.model.Message;
import com.chat.server.payload.request.ChatMessage;
import com.chat.server.service.MessageService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MessageServiceImpl implements MessageService {
    @Override
    public Message saveMessage(ChatMessage chatMessage) {
        return null;
    }

    @Override
    public List<Message> findAllMessageByChannel(String channelId) {
        return null;
    }
}
