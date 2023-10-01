package com.chat.server.model;

//import jakarta.persistence.*;

import jakarta.validation.constraints.Pattern;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "User")
@Getter
@Setter
@ToString
public class User {
    @Id
    private Long id;

    private String username;

    private String email;

    private String password;
    @Pattern(regexp = "(\\+?84|0[3|5|7|8|9])\\d{8}", message = "Phone number invalid")
    private String phoneNumber;
    private String firstname;
    private String lastname;
    private String address;

    public User(String username, String email, String password, String phoneNumber) {
        this.username = username;
        this.email = email;
        this.password = password;
        this.phoneNumber = phoneNumber;
    }



}
