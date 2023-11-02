package com.chat.server.controller;

import com.chat.server.security.UserPrincipal;
import com.chat.server.service.scheduler.OnlineStatusScheduler;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.stereotype.Controller;

@Controller
@Slf4j
@AllArgsConstructor
public class HeartbeatController {
    private final OnlineStatusScheduler scheduler;
    @MessageMapping("/heartbeat-online")
    public void handleHeartbeatOnline(UserPrincipal user) {
        scheduler.userHeartbeatReceive(user.getName());
    }
}
