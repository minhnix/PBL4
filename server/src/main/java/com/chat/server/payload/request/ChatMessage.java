package com.chat.server.payload.request;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.time.LocalDateTime;

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
    private String sender;
    private String sendTo;
    private String channelId;
    private String content;
    private Type type;
    private LocalDateTime createdAt;
}


