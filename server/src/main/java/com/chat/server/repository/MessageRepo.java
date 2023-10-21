package com.chat.server.repository;

import com.chat.server.model.Message;
import com.chat.server.repository.custom.CustomizedMessageRepo;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface MessageRepo extends MongoRepository<Message, String>, CustomizedMessageRepo {
}
