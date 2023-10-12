package com.chat.server.repository;

import com.chat.server.model.Message;
import com.chat.server.repository.custom.CustomizedMessageRepo;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.time.Instant;

public interface MessageRepo extends MongoRepository<Message, String>, CustomizedMessageRepo {
}
