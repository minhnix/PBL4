package com.chat.server.service.scheduler;

import com.chat.server.payload.request.CallMessage;

public interface TimeOutCallScheduler {
    void apply(String callId, CallMessage.Type type,String callerId, String answerId);
}
