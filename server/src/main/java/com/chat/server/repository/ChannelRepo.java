package com.chat.server.repository;

import com.chat.server.model.Channel;
import com.chat.server.repository.custom.CustomizedChannelRepo;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface ChannelRepo extends MongoRepository<Channel, String>, CustomizedChannelRepo {
    Optional<Channel> findById(String id);
}
