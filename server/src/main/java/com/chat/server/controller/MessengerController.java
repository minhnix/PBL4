package com.chat.server.controller;

import com.chat.server.exception.ForbiddenException;
import com.chat.server.model.Message;
import com.chat.server.payload.response.CursorPageResponse;
import com.chat.server.security.CurrentUser;
import com.chat.server.security.CustomUserDetails;
import com.chat.server.service.MessageService;
import com.chat.server.util.CursorPageable;
import com.chat.server.util.TimeConvert;
import lombok.RequiredArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/messages")
public class MessengerController {
    private final MessageService messageService;

    @GetMapping("/{channelId}")
    public CursorPageResponse<Message, String> findAllMessageByChannel(
            @PathVariable("channelId") String channelId,
            @RequestParam(value = "size", defaultValue = "30") int size,
            @RequestParam(value = "pre", required = false) String pre,
            @RequestParam(value = "next", required = false) String next,
            @CurrentUser CustomUserDetails user
    ) {
        if (user == null) {
            throw new ForbiddenException("Access denied");
        }
        CursorPageable<ObjectId> pageable = new CursorPageable<>();
        pageable.setSize(size);
        pageable.setColumnName("id");
        pageable.setNextCursor(StringUtils.hasText(next) ? new ObjectId(next): null );
        pageable.setPreviousCursor(StringUtils.hasText(pre) ? new ObjectId(pre) : null);
        return messageService.findAllMessageByChannel(channelId, pageable, user);
    }
}
