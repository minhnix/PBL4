package com.chat.server.repository;

import com.chat.server.model.Channel;
import com.chat.server.model.User;
import com.chat.server.repository.custom.CustomizedChannelRepo;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

public interface ChannelRepo extends MongoRepository<Channel, String>, CustomizedChannelRepo {
    Optional<Channel> findById(String id);
}
