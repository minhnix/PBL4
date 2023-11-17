package com.chat.server.service.scheduler;

import com.chat.server.service.UserService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.TaskScheduler;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ScheduledFuture;

@Service
@Slf4j
public class OnlineStatusSchedulerService implements OnlineStatusScheduler {
    private final Map<String, Long> userStatus = new ConcurrentHashMap<>();
    private final Map<String, ScheduledFuture<?>> userTasks = new ConcurrentHashMap<>();
    private final TaskScheduler taskScheduler;
    private final UserService userService;
    private static final long MAX_IDLE_TIME = 60 * 1000;

    public OnlineStatusSchedulerService(TaskScheduler taskScheduler, UserService userService) {
        this.taskScheduler = taskScheduler;
        this.userService = userService;
    }

    @Override
    public void userHeartbeatReceive(String userId) {
        userStatus.put(userId, System.currentTimeMillis());
        ScheduledFuture<?> task = userTasks.get(userId);
        if (task != null) {
            task.cancel(false);
        } else {
            userService.changeOnlineStatus(userId, true);
        }

        task = taskScheduler.schedule(() -> {
            long lastHeartbeatTime = userStatus.getOrDefault(userId, 0L);
            long currentTime = System.currentTimeMillis();
            if (currentTime - lastHeartbeatTime >= MAX_IDLE_TIME) {
                userStatus.remove(userId);
                userTasks.remove(userId);
                userService.changeOnlineStatus(userId, false);
            }
        }, Instant.now().plusMillis(MAX_IDLE_TIME));
        userTasks.put(userId, task);
    }

    @Override
    @Scheduled(fixedDelay = 5 * 60 * 1000)
    public void checkStatusScheduler() {
        log.info("Scheduler: checkStatusScheduler");
        long currentTime = System.currentTimeMillis();
        for (String userId : userStatus.keySet()) {
            long lastHeartbeatTime = userStatus.get(userId);
            if (currentTime - lastHeartbeatTime >= MAX_IDLE_TIME) {
                userStatus.remove(userId);
                userTasks.remove(userId);
                userService.changeOnlineStatus(userId, false);
            }
        }
    }
}
