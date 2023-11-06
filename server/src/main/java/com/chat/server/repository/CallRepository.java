package com.chat.server.repository;

import com.chat.server.model.Call;
import com.chat.server.repository.custom.CustomizedCallRepo;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface CallRepository extends MongoRepository<Call, String>, CustomizedCallRepo {
    Optional<Call> findByChannelId(String channelId);
}
