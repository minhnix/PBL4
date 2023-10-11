package com.chat.server.service;

import com.chat.server.model.Message;
import com.chat.server.payload.request.ChatMessage;
import com.chat.server.payload.response.CursorPageResponse;
import com.chat.server.security.CustomUserDetails;
import com.chat.server.util.CursorPageable;

import java.time.Instant;
import java.util.List;

public interface MessageService {
    Message saveMessage(ChatMessage chatMessage);
    CursorPageResponse<Message, Instant> findAllMessageByChannel(String channelId, CursorPageable<Instant> pageable, CustomUserDetails user);

}
