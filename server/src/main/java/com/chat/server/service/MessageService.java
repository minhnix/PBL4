package com.chat.server.service;

import com.chat.server.model.Message;
import com.chat.server.payload.request.ChatMessage;

import java.util.List;

public interface MessageService {
    Message saveMessage(ChatMessage chatMessage);
    List<Message> findAllMessageByChannel(String channelId);

}
