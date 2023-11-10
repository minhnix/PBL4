package com.chat.server.repository;

import com.chat.server.model.Call;
import com.chat.server.repository.custom.CustomizedCallRepo;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.util.Optional;

public interface CallRepository extends MongoRepository<Call, String>, CustomizedCallRepo {
    Optional<Call> findByChannelId(String channelId);
    @Query("{$or: [{sendTo: ?0}, {'sender.userId': ?0}]}")
    Call findByUserId(String userId);
}
