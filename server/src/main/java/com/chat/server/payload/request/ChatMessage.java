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
    private String id;
    private String sender;
    private String channelId;
    private String content;
    private LocalDateTime createdAt;
}
