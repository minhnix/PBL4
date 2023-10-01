package com.chat.server.util;



import com.chat.server.model.User;
import com.chat.server.payload.response.UserSummary;

public class ModelMapper {

    public static UserSummary mapUserToUserSummary(User user) {
        return new UserSummary(user.getId(), user.getUsername(), user.getEmail());
    }


}
