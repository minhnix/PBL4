package com.chat.server.repository.custom;

import org.bson.types.ObjectId;

public interface CustomizedMessageRepo {
    boolean existsByChannelIdAndIdLessThan(String channelId, String id);
}
