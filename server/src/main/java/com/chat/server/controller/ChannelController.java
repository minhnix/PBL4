package com.chat.server.controller;

import com.chat.server.model.Channel;
import com.chat.server.model.User;
import com.chat.server.payload.request.ChannelRequest;
import com.chat.server.payload.request.SignUpRequest;
import com.chat.server.payload.request.UserHelper;
import com.chat.server.payload.response.ApiResponse;
import com.chat.server.payload.response.PagedResponse;
import com.chat.server.service.ChannelService;
import com.chat.server.service.impl.ChannelServiceImpl;
import com.chat.server.util.AppConstants;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;

@RestController
@RequestMapping("/api/v1/channels")
@AllArgsConstructor
@Slf4j
public class ChannelController {

    public final ChannelService channelService;

    @GetMapping({"/", ""})
    public PagedResponse<Channel> getAllChannels(
            @RequestParam(value = "page", defaultValue = AppConstants.DEFAULT_PAGE_NUMBER) int page,
            @RequestParam(value = "size", defaultValue = AppConstants.DEFAULT_PAGE_SIZE) int size,
            @RequestParam(value = "sortBy", defaultValue = AppConstants.SORT_BY_ID, required = false) String sortBy,
            @RequestParam(value = "sortDir", defaultValue = AppConstants.SORT_ASC, required = false) String sortDir,
            @RequestParam(value = "keyword", required = false) String keyword
    ) {
        return channelService.getAll(page, size, sortBy, sortDir, keyword);
    }

    @PostMapping("/create")
    public ResponseEntity<?> createChannel(@Valid @RequestBody ChannelRequest channelRequest) {
        Channel channel = channelService.createChannel(channelRequest.getType(), channelRequest.getName(), channelRequest.getUsers());

        URI location = ServletUriComponentsBuilder
                .fromCurrentContextPath().path("api/channels/{name}")
                .buildAndExpand(channel.getName()).toUri();

        return ResponseEntity.created(location).body(new ApiResponse(true, "Channel create successfully"));
    }

    @GetMapping("/{idChannel}")
    public ResponseEntity<Channel> findChannel(@PathVariable("idUser") String idUser) {
        Channel channel = channelService.findChannel(idUser);
        return ResponseEntity.ok(channel);
    }

    @GetMapping("/search/{idUser}")
    public ResponseEntity<Channel> findAllChannelByUser(@PathVariable("idUser") String idUser) {
        Channel channel = channelService.findChannel(idUser);
        return ResponseEntity.ok(channel);
    }

    @PostMapping("/addUser")
    public ResponseEntity<?> addUser(@Valid @RequestBody UserHelper userHelper) {
        channelService.addUserToChannel(userHelper.getIdChannel(), userHelper.getIdUser());
        return ResponseEntity.ok(new ApiResponse(true, "User added to channel successfully"));
    }

    @DeleteMapping("/removeUser")
    public ResponseEntity<?> reomveUser(@Valid @RequestBody UserHelper userHelper) {
        channelService.removeUserInChannel(userHelper.getIdChannel(), userHelper.getIdUser());
        return ResponseEntity.ok(new ApiResponse(true, "User removed from channel successfully"));
    }

}
