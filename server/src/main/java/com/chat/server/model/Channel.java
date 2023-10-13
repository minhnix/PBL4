package com.chat.server.model;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer;
import lombok.*;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.FieldType;
import org.springframework.data.mongodb.core.mapping.MongoId;

import java.util.Set;

@Document(collection = Channel.COLLECTION_NAME)
@Getter
@Setter
@ToString
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@NoArgsConstructor
@Builder
public class Channel {
    public static final String COLLECTION_NAME = "Channel";
    @MongoId(FieldType.OBJECT_ID)
    private String id;
    private String name;
    private String type;
    @JsonSerialize(contentUsing = ToStringSerializer.class)
    private Set<ObjectId> users;
}
