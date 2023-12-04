package com.chat.server.config;

import com.chat.server.exception.ForbiddenException;
import com.chat.server.payload.response.UserSummary;
import com.chat.server.security.JwtTokenProvider;
import com.chat.server.security.UserPrincipal;
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
import org.springframework.util.Assert;
import org.springframework.util.StringUtils;

@Slf4j
@Component
@RequiredArgsConstructor
public class AuthenticationInterceptor implements ChannelInterceptor {
    private final JwtTokenProvider jwtTokenProvider;
    private final ChannelService channelService;

    public Message<?> preSend(Message<?> message, MessageChannel channel) {
        StompHeaderAccessor accessor = MessageHeaderAccessor.getAccessor(message, StompHeaderAccessor.class);
        if (StompCommand.CONNECT.equals(accessor.getCommand())) {
            log.info("Pre Send: Connect ");
            Assert.notNull(accessor.getFirstNativeHeader("Authorization"), "No authentication token");
            String token = accessor.getFirstNativeHeader("Authorization");
            if (StringUtils.hasText(token) && token.startsWith("Bearer ")) {
                token = token.substring(7);
                jwtTokenProvider.validateToken(token);
                UserSummary user = jwtTokenProvider.getUserFromJwt(token);
                UserPrincipal userPrincipal = new UserPrincipal(user.getId(), user.getUsername());
                accessor.setUser(userPrincipal);
            }
        }
        if (StompCommand.SUBSCRIBE.equals(accessor.getCommand())) {
            log.info("Pre send: Subscribe");
            if (accessor.getUser() == null)
                throw new ForbiddenException("Access denied");
            String userId = accessor.getUser().getName();
            String destination = accessor.getDestination();
            String[] split = destination.split("/"); // destination: /user/{id}/pm or /topic/group/{group_id}
            if (split[0].equals("user") && split[2].equals("pm")) {
                if (!userId.equals(split[1])) {
                    throw new ForbiddenException("Access denied");
                }
            }
            if (split[0].equals("topic") && split[1].equals("group")) {
                if (channelService.isUserJoinChannel(destination, userId))
                    throw new ForbiddenException("Access denied");
            }
        }
        return message;
    }
}
