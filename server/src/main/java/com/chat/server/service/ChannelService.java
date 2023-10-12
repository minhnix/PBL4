package com.chat.server.service;

import com.chat.server.model.Channel;
import com.chat.server.payload.response.PagedResponse;

import java.util.Set;

public interface ChannelService {
    Channel createChannel(String type, String name, Set<String> userIds);
    Channel findChannel(String channelId);
    Set<Channel> findAllChannelByUser(String userId);
    void addUserToChannel(String channelId, String userId);
    void removeUserInChannel(String channelId, String userId);
    boolean isUserJoinChannel(String channelId, String userId);

    PagedResponse<Channel> getAll(int page, int size, String sortBy, String sortDir, String keyword);
}