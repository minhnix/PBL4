package com.chat.server.controller;

import com.chat.server.exception.ForbiddenException;
import com.chat.server.model.Channel;
import com.chat.server.model.Message;
import com.chat.server.payload.request.ChannelRequest;
import com.chat.server.payload.request.ChatMessage;
import com.chat.server.payload.request.UserHelper;
import com.chat.server.payload.response.ApiResponse;
import com.chat.server.payload.response.ChannelInfo;
import com.chat.server.security.CurrentUser;
import com.chat.server.security.CustomUserDetails;
import com.chat.server.service.ChannelService;
import com.chat.server.service.MessageService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.bson.types.ObjectId;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;

@RestController
@RequestMapping("/api/v1/channels")
@AllArgsConstructor
@Slf4j
public class ChannelController {

    private final ChannelService channelService;
    private final SimpMessagingTemplate template;
    private final MessageService messageService;


    @GetMapping({"/", ""})
    public ResponseEntity<?> getAllChannels(@CurrentUser CustomUserDetails currentUser, @RequestParam(value = "type", required = false) String type) {
        if (currentUser == null) throw new ForbiddenException("Access Denied");
        if (type != null && type.equals("group"))
            return ResponseEntity.ok(channelService.getAllGroupOfUser(currentUser.getId()));
        return ResponseEntity.ok(channelService.findAllChannelByUser(currentUser.getId()));
    }

    @GetMapping("/search")
    public ResponseEntity<?> findByKeyword(
            @RequestParam(value = "q", defaultValue = "") String keyword,
            @CurrentUser CustomUserDetails currentUser
    ) {
        if (currentUser == null) throw new ForbiddenException("Access Denied");
        return ResponseEntity.ok(channelService.findByKeyword(keyword, currentUser.getId()));
    }

    @PostMapping("/create")
    public ResponseEntity<?> createChannel(@Valid @RequestBody ChannelRequest channelRequest) {
        Channel channel = channelService.createChannel(channelRequest.getType(), channelRequest.getName(), channelRequest.getUsers());
        if (channel.getType().equals("group")) {
            ChatMessage chatMessage = ChatMessage.builder()
                    .content("Nhóm " + channel.getName() + " đã được lập")
                    .channelId(channel.getId())
                    .type(ChatMessage.Type.CREATE)
                    .build();
            Message message = messageService.saveMessage(chatMessage);
            for (ObjectId userId : channel.getUsers()) {
                template.convertAndSendToUser(userId.toString(), "/pm", message);
            }
        }
        return ResponseEntity.ok(new ApiResponse(true, "Channel create successfully"));
    }

    @GetMapping("/{channelId}")
    public ResponseEntity<ChannelInfo> findChannel(@PathVariable("channelId") String channelId,
                                                   @CurrentUser CustomUserDetails user
    ) {
        return ResponseEntity.ok(channelService.findChannel(channelId, user.getId()));
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
