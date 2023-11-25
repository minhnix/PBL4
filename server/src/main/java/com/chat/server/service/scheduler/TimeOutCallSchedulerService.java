package com.chat.server.service.scheduler;

import com.chat.server.payload.request.CallMessage;
import com.chat.server.service.call.CallService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.TaskScheduler;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ScheduledFuture;

@Service
@Slf4j
public class TimeOutCallSchedulerService implements TimeOutCallScheduler {
    private final Map<String, Long> callStartTimes = new ConcurrentHashMap<>();
    private final Map<String, ScheduledFuture<?>> tasks = new ConcurrentHashMap<>();
    private final CallService callService;
    private final TaskScheduler taskScheduler;
    private final SimpMessagingTemplate simpMessagingTemplate;
    private static final long MAX_IDLE_TIME = 30 * 1000;


    public TimeOutCallSchedulerService(CallService callService, TaskScheduler taskScheduler, SimpMessagingTemplate simpMessagingTemplate) {
        this.callService = callService;
        this.taskScheduler = taskScheduler;
        this.simpMessagingTemplate = simpMessagingTemplate;
    }

    @Override
    public void apply(CallMessage callMessage) {
        String callId = callMessage.getPayload().getCallId();
        if (callMessage.getType() == CallMessage.Type.CREATE) {
            callStartTimes.put(callId, System.currentTimeMillis());
            ScheduledFuture<?> task = tasks.get(callId);
            if (task == null) {
                task = taskScheduler.schedule(() -> {
                    callService.delete(callId);
                    //TODO: save message
                    //TODO: remove useless delete api (duplicate api call)
                    sendCancelMessage(callMessage);
                }, Instant.now().plusMillis(MAX_IDLE_TIME));
                tasks.put(callId, task);
            } else {
                task.cancel(false);
            }
        } else if (callMessage.getType() == CallMessage.Type.JOIN) {
            ScheduledFuture<?> task = tasks.get(callId);
            if (task != null) task.cancel(false);
            tasks.remove(callId);
            callStartTimes.remove(callId);
        }
    }

    private void sendCancelMessage(CallMessage callMessage) {
        callMessage.setType(CallMessage.Type.CANCEL);
        simpMessagingTemplate.convertAndSendToUser(callMessage.getSender().getUserId(), "/call", callMessage);
        simpMessagingTemplate.convertAndSendToUser(callMessage.getSendTo(), "/call", callMessage);
    }
}
