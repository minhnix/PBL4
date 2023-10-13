package com.chat.server.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.validation.constraints.Pattern;
import lombok.*;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.FieldType;
import org.springframework.data.mongodb.core.mapping.MongoId;

import java.time.Instant;
import java.util.Set;

@Document(collection = User.COLLECTION_NAME)
@Getter
@Setter
@ToString
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@NoArgsConstructor
@Builder
public class User {
    public static final String COLLECTION_NAME = "User";
    @MongoId(FieldType.OBJECT_ID)
    private String id;
    private String username;
    private String email;
    @JsonIgnore
    private String password;
    @Pattern(regexp = "(\\+?84|0[3|5|7|8|9])\\d{8}", message = "Phone number invalid")
    private String phoneNumber;
    private String firstname;
    private String lastname;
    private String address;
    private Boolean isOnline;
    private Instant lastOnline;
    @JsonIgnore
    private Set<ObjectId> channels;
}
