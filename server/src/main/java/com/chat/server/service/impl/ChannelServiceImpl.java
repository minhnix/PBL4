package com.chat.server.service.impl;


import com.chat.server.exception.BadRequestException;
import com.chat.server.exception.ForbiddenException;
import com.chat.server.model.Channel;
import com.chat.server.payload.response.ChannelInfo;
import com.chat.server.payload.response.ChannelMessage;
import com.chat.server.payload.response.SearchChannelResponse;
import com.chat.server.repository.ChannelRepo;
import com.chat.server.repository.UserRepo;
import com.chat.server.service.ChannelService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.bson.types.ObjectId;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

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

    public ChannelInfo findChannel(String channelId, String userId) {
        ChannelInfo channelInfo = channelRepo.findDetailById(channelId).orElseThrow(() -> new BadRequestException("Channel " + channelId + " not found"));
        if (channelInfo.getUsers().stream().noneMatch(user -> user.getId().equals(userId)))
            throw new ForbiddenException("Access denied");
        channelInfo.setOnline(
                channelInfo.getUsers().stream().anyMatch(user -> {
                    if (user.getId().equals(userId)) return false;
                    if (user.getIsOnline() == null) return false;
                    return user.getIsOnline();
                })
        );
        if (channelInfo.getType().equals("group")) return channelInfo;

        for (var user : channelInfo.getUsers()) {
            if (!user.getId().equals(userId)) {
                channelInfo.setName(user.getUsername());
            }
        }
        return channelInfo;
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
    public List<SearchChannelResponse> findByKeyword(String keyword, String userId) {
        return channelRepo.findByKeyword(keyword, userId);
    }

    @Override
    public List<String> getAllGroupOfUser(String userId) {
        return channelRepo.findAllByUsersAndType(new ObjectId(userId), "group").stream()
                .map(Channel::getId).collect(Collectors.toList());
    }
}
