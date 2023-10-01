package com.chat.server.payload.request;

import jakarta.validation.constraints.Pattern;
import lombok.Getter;
import lombok.Setter;


public class UserRequest {
    private String username;

    private String email;

    private String password;
    @Pattern(regexp = "(\\+?84|0[3|5|7|8|9])\\d{8}", message = "Phone number invalid")
    private String phoneNumber;
    private String firstname;
    private String lastname;
    private String address;

}
