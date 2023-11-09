package com.chat.server.service;

import com.chat.server.model.Call;
import com.chat.server.model.UserWithUsername;
import com.chat.server.payload.request.CallRequest;

import java.util.Optional;

public interface CallService {
    Optional<Call> findByChannelId(String channelId);

    Call create(String sendTo, UserWithUsername sender, CallRequest callRequest);

    void update(CallRequest callRequest);

    Optional<Call> findById(String id);

    void delete(String id);
}
