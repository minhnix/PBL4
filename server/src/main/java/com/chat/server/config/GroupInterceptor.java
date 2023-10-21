package com.chat.server.config;

import com.chat.server.exception.ForbiddenException;
import com.chat.server.service.ChannelService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.messaging.support.MessageHeaderAccessor;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class GroupInterceptor implements ChannelInterceptor {
    private final ChannelService channelService;

    @Override
    public Message<?> preSend(Message<?> message, MessageChannel channel) {
        StompHeaderAccessor accessor = MessageHeaderAccessor.getAccessor(message, StompHeaderAccessor.class);
        log.info("Pre send: Group author subscribe");
        if (StompCommand.SUBSCRIBE.equals(accessor.getCommand())) {
            String destination = accessor.getDestination();
            if (accessor.getUser() == null)
                throw new ForbiddenException("Access denied");
            String userId = accessor.getUser().getName();
            if (channelService.isUserJoinChannel(destination, userId))
                throw new ForbiddenException("Access denied");
        }
        return message;
    }
}
