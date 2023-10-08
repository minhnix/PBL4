package com.chat.server.service;

import com.chat.server.model.User;
import com.chat.server.payload.request.SignUpRequest;
import com.chat.server.payload.response.PagedResponse;

public interface UserService {
    User createUser(SignUpRequest signUpRequest);

    User getOneUser(String username);

    PagedResponse<User> getAll(int page, int size, String sortBy, String sortDir, String keyword);

    void deleteUser(String id);
}
