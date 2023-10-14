package com.chat.server.payload.request;

import com.chat.server.model.UserWithUsername;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.time.Instant;

@Getter
@Setter
@Builder
@ToString
public class ChatMessage {
    public enum Type {
        MESSAGE,
        JOIN,
        LEAVE
    }

    private String id;
    private UserWithUsername sender;
    private String sendTo;
    private String channelId;
    private String content;
    private Type type;
    private Instant createdAt;
}


