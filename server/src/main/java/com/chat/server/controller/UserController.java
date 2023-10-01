package com.chat.server.controller;


import com.chat.server.model.User;
import com.chat.server.payload.request.SignUpRequest;
import com.chat.server.payload.response.PagedResponse;
import com.chat.server.service.UserService;
import com.chat.server.util.AppConstants;
import com.chat.server.util.ModelMapper;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;


@RestController
@RequestMapping ("/api/v1/users")
public class UserController {
    private final UserService userService;


    public UserController(UserService userService) {
        this.userService = userService;
    }


    @GetMapping("hello")
    public String hello() {
        return "hello";
    }
    @GetMapping
    public PagedResponse<User> getAllUsers(
            @RequestParam(value = "page", defaultValue = AppConstants.DEFAULT_PAGE_NUMBER) int page,
            @RequestParam(value = "size", defaultValue = AppConstants.DEFAULT_PAGE_SIZE) int size,
            @RequestParam(value = "sortBy", defaultValue = AppConstants.SORT_BY_ID, required = false) String sortBy,
            @RequestParam(value = "sortDir", defaultValue = AppConstants.SORT_ASC, required = false) String sortDir,
            @RequestParam(value = "keyword", required = false) String keyword
    ) {
        return userService.getAll(page, size, sortBy, sortDir, keyword);
    }


    @GetMapping("/{username}")
    public User getOne(@PathVariable("username") String username) {
        return userService.getOneUser(username);
    }


    @PostMapping
    public ResponseEntity<?> createUser(@Valid @RequestBody SignUpRequest signUpRequest) {
        User user = userService.createUser(signUpRequest);

        URI location = ServletUriComponentsBuilder
                .fromCurrentContextPath().path("/api/users/{username}")
                .buildAndExpand(user.getUsername()).toUri();

        return ResponseEntity.created(location).body(ModelMapper.mapUserToUserSummary(user));
    }
}
