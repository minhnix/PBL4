package com.chat.server.repository;

import com.chat.server.model.Message;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.time.Instant;

public interface MessageRepo extends MongoRepository<Message, String> {
    boolean existsByChannelIdAndCreatedAtLessThan(String channelId, Instant instant);
}
