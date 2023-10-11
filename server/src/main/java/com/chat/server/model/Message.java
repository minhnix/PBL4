package com.chat.server.model;

import com.chat.server.payload.request.ChatMessage;
import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Document(collection = "Message")
@Getter
@Setter
@ToString
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@NoArgsConstructor
@Builder
public class Message {
    @Id
    private String id;
    private String sender;
    private String channelId;
    private String sendTo;
    private String content;
    private ChatMessage.Type type;
    private Instant createdAt;
}
