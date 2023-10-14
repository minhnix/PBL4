package com.chat.server.config;

import com.chat.server.model.User;
import com.chat.server.security.JwtTokenProvider;
import com.chat.server.security.UserPrincipal;
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

import java.security.Principal;

@Slf4j
@Component
@RequiredArgsConstructor
public class AuthenticationInterceptor implements ChannelInterceptor {
    private final JwtTokenProvider jwtTokenProvider;

    public Message<?> preSend(Message<?> message, MessageChannel channel) {
        StompHeaderAccessor accessor = MessageHeaderAccessor.getAccessor(message, StompHeaderAccessor.class);
        log.info("Pre Send: Authentication ");
        if (StompCommand.CONNECT.equals(accessor.getCommand())) {
            Assert.notNull(accessor.getHeader("Authorization"), "No authentication token");
            String token = accessor.getFirstNativeHeader("Authorization");
            if (StringUtils.hasText(token) && token.startsWith("Bearer ")) {
                token = token.substring(7);
                jwtTokenProvider.validateToken(token);
                User user = jwtTokenProvider.getUserFromJwt(token);
                log.info("user send: {}", user);
                UserPrincipal userPrincipal = new UserPrincipal(user.getId(), user.getUsername());
                accessor.setUser(userPrincipal);
            }
        }
        return message;
    }
}
