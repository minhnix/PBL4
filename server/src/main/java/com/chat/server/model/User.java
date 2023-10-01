package com.chat.server.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.validation.constraints.Pattern;
import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "User")
@Getter
@Setter
@ToString
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@NoArgsConstructor
@Builder
public class User {
    @Id
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
}
