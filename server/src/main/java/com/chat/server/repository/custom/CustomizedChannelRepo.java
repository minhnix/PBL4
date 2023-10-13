package com.chat.server.repository.custom;

import com.chat.server.payload.response.ChannelInfo;

import java.util.Optional;

public interface CustomizedChannelRepo {
    void removeUserFromChannel(String userId, String channelId);
    void addUserToChannel(String userId, String channelId);
    boolean existsUserInChannel(String channelId, String userId);
    Optional<ChannelInfo> findDetailById(String id);

}
