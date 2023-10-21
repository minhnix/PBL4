package com.chat.server.model;

import com.chat.server.payload.request.ChatMessage;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer;
import lombok.*;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.FieldType;
import org.springframework.data.mongodb.core.mapping.MongoId;

import java.time.Instant;

@Document(collection = Message.COLLECTION_NAME)
@Getter
@Setter
@ToString
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@NoArgsConstructor
@Builder
public class Message {
    public static final String COLLECTION_NAME = "Message";
    @MongoId(FieldType.OBJECT_ID)
    private String id;
    private UserWithUsername sender;
    @JsonSerialize(using = ToStringSerializer.class)
    private ObjectId channelId;
    private String sendTo;
    private String content;
    private ChatMessage.Type type;
    private Instant createdAt;
}
