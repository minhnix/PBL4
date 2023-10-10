package com.chat.server.repository;

import com.chat.server.model.Channel;
import com.chat.server.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ChannelRepo extends MongoRepository<Channel, String> {
    Optional<Channel> findById(String id);

    Page<Channel> findByNameContaining(String keyword, String keyword1, String keyword2, Pageable pageable);

//    Iterable<Channel> findByUsersContaining(String userId);
}
