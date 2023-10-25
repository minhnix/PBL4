package com.chat.server.repository.custom;

public interface CustomizedUserRepo {
    void removeChannelFromUser(String channelId, String userId);

    void addChannelToUser(String channelId, String userId);
    void updateOnlineStatus(String userId, boolean status);
}
