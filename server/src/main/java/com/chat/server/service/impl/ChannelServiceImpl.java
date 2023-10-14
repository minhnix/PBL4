package com.chat.server.service.impl;


import com.chat.server.exception.BadRequestException;
import com.chat.server.model.Channel;
import com.chat.server.model.User;
import com.chat.server.payload.response.ChannelInfo;
import com.chat.server.payload.response.ChannelMessage;
import com.chat.server.payload.response.PagedResponse;
import com.chat.server.repository.ChannelRepo;
import com.chat.server.repository.UserRepo;
import com.chat.server.service.ChannelService;
import com.chat.server.util.ValidatePageable;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.bson.types.ObjectId;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Set;

@Service
@Slf4j
@RequiredArgsConstructor
public class ChannelServiceImpl implements ChannelService {
    private final ChannelRepo channelRepo;
    private final UserRepo userRepo;

    public Channel createChannel(String type, String name, Set<ObjectId> userIds) {
        if (type.equals("pm") && userIds.size() != 2) {
            throw new BadRequestException("Number of user must be 2");
        }

        Channel channel = Channel.builder()
                .type(type)
                .name(name)
                .users(userIds)
                .build();


        Channel channel1 = channelRepo.save(channel);
        for (var userId : userIds)
            userRepo.addChannelToUser(channel1.getId(), userId.toString());
        return channel1;
    }

    public ChannelInfo findChannel(String channelId) {
        return channelRepo.findDetailById(channelId).orElseThrow(() -> new BadRequestException("Channel " + channelId + " not found"));
    }

    public List<ChannelMessage> findAllChannelByUser(String userId) {
        return channelRepo.findAllChannelByUser(userId);
    }

    public void addUserToChannel(String channelId, String userId) {
        Channel channel = channelRepo.findById(channelId).orElseThrow(() -> new BadRequestException("Channel not found"));
        boolean isUserJoined = channel.getUsers().stream().anyMatch(user -> user.equals(new ObjectId(userId)));
        if (isUserJoined) {
            throw new BadRequestException("User already join channel");
        }
        channelRepo.addUserToChannel(userId, channelId);
        userRepo.addChannelToUser(channelId, userId);
    }

    public void removeUserInChannel(String channelId, String userId) {
        Channel channel = channelRepo.findById(channelId).orElseThrow(() -> new BadRequestException("Channel not found"));
        boolean isUserJoined = channel.getUsers().stream().anyMatch(user -> user.equals(new ObjectId(userId)));
        if (!isUserJoined) {
            throw new BadRequestException("User not join channel");
        }
        if (channel.getUsers().size() == 1) {
            channelRepo.delete(channel);
        } else {
            channelRepo.removeUserFromChannel(userId, channelId);
        }
        userRepo.removeChannelFromUser(channelId, userId);
    }

    public boolean isUserJoinChannel(String channelId, String userId) {
        return channelRepo.existsUserInChannel(channelId, userId);
    }

    @Override
    public List<Channel> findByKeyword(String keyword) {
        return channelRepo.findByNameContaining(keyword);
    }

}
