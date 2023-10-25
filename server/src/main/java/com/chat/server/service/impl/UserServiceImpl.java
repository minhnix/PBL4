package com.chat.server.service.impl;


import com.chat.server.exception.BadRequestException;
import com.chat.server.exception.ResourceNotFoundException;
import com.chat.server.model.User;
import com.chat.server.payload.request.SignUpRequest;
import com.chat.server.payload.response.PagedResponse;
import com.chat.server.repository.UserRepo;
import com.chat.server.security.CustomUserDetails;
import com.chat.server.service.UserService;
import com.chat.server.util.ValidatePageable;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;


@Service
@Slf4j
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
    private final UserRepo userRepo;
    private final PasswordEncoder passwordEncoder;

    public User createUser(SignUpRequest signUpRequest) {
        if (userRepo.existsByEmail(signUpRequest.getEmail())) {
            throw new BadRequestException("Email already in use!!!");
        }
        if (userRepo.existsByUsername(signUpRequest.getUsername())) {
            throw new BadRequestException("Username already in use!!!");
        }
        User user = User.builder()
                .username(signUpRequest.getUsername())
                .email(signUpRequest.getEmail())
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

    @Override
    public List<User> findByKeyword(String keyword, CustomUserDetails user) {
        if (user == null)
            return userRepo.findByUsernameContaining(keyword);
        else
            return userRepo.findByIdIsNotAndUsernameContaining(user.getId(), keyword);
    }

    @Override
    public void changeOnlineStatus(String userId, boolean status) {
        userRepo.updateOnlineStatus(userId, status);
    }
}
