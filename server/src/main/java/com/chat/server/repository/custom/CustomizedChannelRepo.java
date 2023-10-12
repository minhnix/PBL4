package com.chat.server.repository.custom;

public interface CustomizedChannelRepo {
    void removeUserFromChannel(String userId, String channelId);
    void addUserToChannel(String userId, String channelId);
    boolean existsUserInChannel(String channelId, String userId);

}
