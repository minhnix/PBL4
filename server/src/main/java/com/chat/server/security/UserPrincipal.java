package com.chat.server.security;

import java.security.Principal;

public class UserPrincipal implements Principal {
    private String id;

    public UserPrincipal(String id) {
        this.id = id;
    }

    @Override
    public String getName() {
        return this.id;
    }
}
