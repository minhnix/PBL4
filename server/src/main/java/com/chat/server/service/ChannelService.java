package com.chat.server.service;

import com.chat.server.model.Channel;
import com.chat.server.payload.response.ChannelInfo;
import com.chat.server.payload.response.ChannelMessage;
import com.chat.server.payload.response.PagedResponse;
import org.bson.types.ObjectId;

import java.util.List;
import java.util.Set;

public interface ChannelService {
    Channel createChannel(String type, String name, Set<ObjectId> userIds);
    ChannelInfo findChannel(String channelId);
    List<ChannelMessage> findAllChannelByUser(String userId);
    void addUserToChannel(String channelId, String userId);
    void removeUserInChannel(String channelId, String userId);
    boolean isUserJoinChannel(String channelId, String userId);
    List<Channel> findByKeyword(String keyword); //find channel and User
}
