package com.chat.server.service;

import com.chat.server.model.Channel;
import com.chat.server.payload.response.ChannelInfo;
import com.chat.server.payload.response.ChannelMessage;
import com.chat.server.payload.response.SearchChannelResponse;
import org.bson.types.ObjectId;

import java.util.List;
import java.util.Set;

public interface ChannelService {
    Channel createChannel(String type, String name, Set<ObjectId> userIds);
    ChannelInfo findChannel(String channelId, String userId);
    List<ChannelMessage> findAllChannelByUser(String userId);
    void addUserToChannel(String channelId, String userId);
    void removeUserInChannel(String channelId, String userId);
    boolean isUserJoinChannel(String channelId, String userId);
    List<SearchChannelResponse> findByKeyword(String keyword, String userId); //find channel and User
    List<String> getAllGroupOfUser(String userId);
}
