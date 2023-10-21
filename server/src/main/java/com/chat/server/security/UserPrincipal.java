package com.chat.server.security;

import java.security.Principal;

public class UserPrincipal implements Principal {
    private String id;
    private String username;

    private UserPrincipal(String id) {
        this.id = id;
    }

    public UserPrincipal(String id, String username) {
        this(id);
        this.username = username;
    }

    @Override
    public String getName() {
        return this.id;
    }

    public String getUsername() {
        return this.username;
    }
}
