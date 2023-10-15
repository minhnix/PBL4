package com.chat.server.controller;


import com.chat.server.model.User;
import com.chat.server.payload.response.PagedResponse;
import com.chat.server.service.impl.UserServiceImpl;
import com.chat.server.util.AppConstants;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
public class UserController {
    private final UserServiceImpl userService;

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

    @GetMapping("/search")
    public List<User> findByKeyword(@RequestParam(value = "q", defaultValue = "") String keyword) {
        return userService.findByKeyword(keyword);
    }
}
