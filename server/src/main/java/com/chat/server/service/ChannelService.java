package com.chat.server.service;

import com.chat.server.model.Channel;

import java.util.Set;

public interface ChannelService {
    Channel findChannel(String channelId);
    Set<Channel> findAllChannelByUser(String userId);
    void addUserToChannel(String channelId, String userId);
    void removeUserInChannel(String channelId, String userId);
    boolean isUserJoinChannel(String channelId, String userId);
}
