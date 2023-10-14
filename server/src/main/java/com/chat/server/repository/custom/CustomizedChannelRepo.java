package com.chat.server.repository.custom;

import com.chat.server.payload.response.ChannelInfo;
import com.chat.server.payload.response.ChannelMessage;

import java.util.List;
import java.util.Optional;

public interface CustomizedChannelRepo {
    void removeUserFromChannel(String userId, String channelId);
    void addUserToChannel(String userId, String channelId);
    boolean existsUserInChannel(String channelId, String userId);
    Optional<ChannelInfo> findDetailById(String id);
    List<ChannelMessage> findAllChannelByUser(String userId);
}
