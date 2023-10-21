package com.chat.server.repository.custom;

public interface CustomizedMessageRepo {
    boolean existsByChannelIdAndIdLessThan(String channelId, String id);
}
