package com.chat.server.model;

import lombok.*;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.FieldType;
import org.springframework.data.mongodb.core.mapping.MongoId;

import java.util.ArrayList;
import java.util.List;

@Document(collection = Call.COLLECTION_NAME)
@Getter
@Setter
@ToString
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@NoArgsConstructor
@Builder
public class Call {
    public static final String COLLECTION_NAME = "Call";
    @MongoId(FieldType.OBJECT_ID)
    private String id;
    private String channelId;
    private List<org.bson.Document> offerCandidates = new ArrayList<>();
    private List<org.bson.Document> answerCandidates = new ArrayList<>();
    private org.bson.Document offerDescription;
    private org.bson.Document answerDescription;
    private String status;
    private String sendTo;
    private UserWithUsername sender;
}
