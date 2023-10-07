package com.chat.server.repository;


import com.chat.server.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;


@Repository
public interface UserRepo extends MongoRepository<User, String> {

    boolean existsByEmail(String email);

    boolean existsByUsername(String username);

    boolean existsByPhoneNumber(String phoneNumber);

    Optional<User> findById(String id);

    Optional<User> findByUsername(String username);

    Page<User> findByUsernameContainingOrEmailContainingOrPhoneNumberContaining(String keyword, String keyword1, String keyword2, Pageable pageable);

    Optional<User> findByUsernameOrEmail(String usernameOrEmail, String usernameOrEmail1);
}