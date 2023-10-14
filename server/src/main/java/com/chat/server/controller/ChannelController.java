package com.chat.server.controller;

import com.chat.server.model.Channel;
import com.chat.server.model.User;
import com.chat.server.payload.request.ChannelRequest;
import com.chat.server.payload.request.SignUpRequest;
import com.chat.server.payload.request.UserHelper;
import com.chat.server.payload.response.ApiResponse;
import com.chat.server.payload.response.ChannelInfo;
import com.chat.server.payload.response.PagedResponse;
import com.chat.server.security.CurrentUser;
import com.chat.server.security.CustomUserDetails;
import com.chat.server.service.ChannelService;
import com.chat.server.service.impl.ChannelServiceImpl;
import com.chat.server.util.AppConstants;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/v1/channels")
@AllArgsConstructor
@Slf4j
public class ChannelController {

    public final ChannelService channelService;

    @GetMapping({"/", ""})
    public ResponseEntity<?> getAllChannels(
            @RequestParam(value = "keyword", required = false) String keyword,
            @CurrentUser CustomUserDetails currentUser
    ) {
        if (currentUser != null && !StringUtils.hasText(keyword)) {
            return ResponseEntity.ok(channelService.findAllChannelByUser(currentUser.getId()));
        }
        return ResponseEntity.ok(channelService.findByKeyword(keyword));
    }


    @PostMapping("/create")
    public ResponseEntity<?> createChannel(@Valid @RequestBody ChannelRequest channelRequest) {
        Channel channel = channelService.createChannel(channelRequest.getType(), channelRequest.getName(), channelRequest.getUsers());

        URI location = ServletUriComponentsBuilder
                .fromCurrentContextPath().path("api/channels/{name}")
                .buildAndExpand(channel.getName()).toUri();

        return ResponseEntity.created(location).body(new ApiResponse(true, "Channel create successfully"));
    }

    @GetMapping("/{channelId}")
    public ResponseEntity<ChannelInfo> findChannel(@PathVariable("channelId") String channelId) {
        return ResponseEntity.ok(channelService.findChannel(channelId));
    }

    @PostMapping("/addUser")
    public ResponseEntity<?> addUser(@Valid @RequestBody UserHelper userHelper) {
        channelService.addUserToChannel(userHelper.getIdChannel(), userHelper.getIdUser());
        return ResponseEntity.ok(new ApiResponse(true, "User added to channel successfully"));
    }

    @DeleteMapping("/removeUser")
    public ResponseEntity<?> removeUser(@Valid @RequestBody UserHelper userHelper) {
        channelService.removeUserInChannel(userHelper.getIdChannel(), userHelper.getIdUser());
        return ResponseEntity.ok(new ApiResponse(true, "User removed from channel successfully"));
    }

}
