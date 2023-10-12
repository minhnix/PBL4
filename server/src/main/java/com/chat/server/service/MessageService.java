package com.chat.server.service;

import com.chat.server.model.Message;
import com.chat.server.payload.request.ChatMessage;
import com.chat.server.payload.response.CursorPageResponse;
import com.chat.server.security.CustomUserDetails;
import com.chat.server.util.CursorPageable;
import org.bson.types.ObjectId;

public interface MessageService {
    Message saveMessage(ChatMessage chatMessage);
    CursorPageResponse<Message, String> findAllMessageByChannel(String channelId, CursorPageable<ObjectId> pageable, CustomUserDetails user);

}
