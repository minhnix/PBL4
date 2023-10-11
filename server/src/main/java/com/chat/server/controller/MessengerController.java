package com.chat.server.controller;

import com.chat.server.exception.ForbiddenException;
import com.chat.server.model.Message;
import com.chat.server.payload.response.CursorPageResponse;
import com.chat.server.security.CurrentUser;
import com.chat.server.security.CustomUserDetails;
import com.chat.server.service.MessageService;
import com.chat.server.util.CursorPageable;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/messages")
public class MessengerController {
    private final MessageService messageService;
    @GetMapping("/{channelId}")
    public CursorPageResponse<Message, Instant> findAllMessageByChannel(
            @PathVariable("channelId") String channelId,
            @RequestParam(value = "size", defaultValue = "30") int size,
            @RequestParam(value = "pre") Instant pre,
            @RequestParam(value = "next") Instant next,
            @CurrentUser CustomUserDetails user
    ) {
        if (user == null) {
            throw new ForbiddenException("Access denied");
        }
        CursorPageable<Instant> pageable = new CursorPageable<>();
        pageable.setSize(size);
        pageable.setColumnName("createdAt");
        pageable.setNextCursor(next);
        pageable.setPreviousCursor(pre);
        return messageService.findAllMessageByChannel(channelId, pageable, user);
    }
}
