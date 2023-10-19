package com.chat.server.payload.response;


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;


@Getter
@Setter
@AllArgsConstructor
public class UserSummary {
    private String id;
    private String username;
    private String email;
}
