package com.chat.server.payload.response;

import com.chat.server.model.User;
import lombok.Getter;
import lombok.Setter;

import java.util.Set;

@Getter
@Setter
public class ChannelInfo {
    private String id;
    private String name;
    private String type;
    private Set<User> users;
    private boolean isOnline;
}
