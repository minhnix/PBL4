package com.chat.server.service;


import com.chat.server.exception.BadRequestException;
import com.chat.server.exception.ResourceNotFoundException;
import com.chat.server.model.User;
import com.chat.server.payload.request.SignUpRequest;
import com.chat.server.payload.response.PagedResponse;
import com.chat.server.repository.UserRepo;
import com.chat.server.util.ValidatePageable;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;


@Service
@Slf4j
public class UserService {
    private final UserRepo userRepo;

    private final PasswordEncoder passwordEncoder;

    Logger logger = LoggerFactory.getLogger(UserService.class);

    public UserService(UserRepo userRepo, PasswordEncoder passwordEncoder) {
        this.userRepo = userRepo;
        this.passwordEncoder = passwordEncoder;
    }

    public User createUser(SignUpRequest signUpRequest) {
        logger.debug("create user" + signUpRequest);
        if (userRepo.existsByEmail(signUpRequest.getEmail())) {
            throw new BadRequestException("Email already in use!!!");
        }
        if (userRepo.existsByUsername(signUpRequest.getUsername())) {
            throw new BadRequestException("Username already in use!!!");
        }
        if (userRepo.existsByPhoneNumber(signUpRequest.getPhoneNumber())) {
            throw new BadRequestException("Phone Number already in use!!!");
        }
        User user = User.builder()
                .username(signUpRequest.getUsername())
                .email(signUpRequest.getEmail())
                .phoneNumber(signUpRequest.getPhoneNumber())
                .password(passwordEncoder.encode(signUpRequest.getPassword()))
                .build();
        if (signUpRequest.getFirstname() != null && signUpRequest.getLastname() != null) {
            user.setFirstname(signUpRequest.getFirstname());
            user.setLastname(signUpRequest.getLastname());
        }
        return userRepo.save(user);
    }

    public User getOneUser(String username) {
        return userRepo.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User", "username", username));
    }

    public PagedResponse<User> getAll(int page, int size, String sortBy, String sortDir, String keyword) {
        ValidatePageable.invoke(page, size);

        Sort sort = (sortDir.equalsIgnoreCase("des")) ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);
        Page<User> users;
        if (keyword == null)
            users = userRepo.findAll(pageable);
        else
            users = userRepo.findByUsernameContainingOrEmailContainingOrPhoneNumberContaining(keyword, keyword, keyword, pageable);
        return new PagedResponse<>(users);
    }

    public void deleteUser(String id) {
        User user = userRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", id));
        userRepo.delete(user);
    }
}