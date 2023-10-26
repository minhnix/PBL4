package com.chat.server.service.scheduler;

public interface OnlineStatusScheduler {
    void userHeartbeatReceive(String userId);
    void checkStatusScheduler();
}
