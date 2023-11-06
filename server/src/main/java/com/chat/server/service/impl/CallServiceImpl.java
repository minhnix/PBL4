package com.chat.server.service.impl;

import com.chat.server.exception.UserCallingException;
import com.chat.server.model.Call;
import com.chat.server.model.UserWithUsername;
import com.chat.server.payload.request.CallRequest;
import com.chat.server.repository.CallRepository;
import com.chat.server.service.CallService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@AllArgsConstructor
public class CallServiceImpl implements CallService {
    private final CallRepository callRepository;

    @Override
    public Optional<Call> findByChannelId(String channelId) {
        return callRepository.findByChannelId(channelId);
    }

    @Override
    public Call create(String sendTo, UserWithUsername sender, CallRequest callRequest) {
        if (callRepository.isUserCalling(sendTo, callRequest.getChannelId())) {
            throw new UserCallingException("User is calling!!!");
        }
        Optional<Call> call = callRepository.findByChannelId(callRequest.getChannelId());
        if (call.isPresent()) {
            call.get().setStatus("JOIN");
            return callRepository.save(call.get());
        } else {
            Call call1 = new Call();
            call1.setChannelId(callRequest.getChannelId());
            call1.setSender(sender);
            call1.setSendTo(sendTo);
            call1.setStatus("CREATE");
            return callRepository.save(call1);
        }
    }

    @Override
    public void update(CallRequest callRequest) {
        if (callRequest.getAnswerCandidate() != null) {
            callRepository.addAnswerCandidate(callRequest.getCallId(), callRequest.getAnswerCandidate());
            return;
        }
        if (callRequest.getOfferCandidate() != null) {
            callRepository.addOfferCandidate(callRequest.getCallId(), callRequest.getOfferCandidate());
            return;
        }
        Call call = callRepository.findById(callRequest.getCallId()).orElse(new Call());
        if (callRequest.getOfferDescription() != null) {
            call.setOfferDescription(callRequest.getOfferDescription());
        }
        if (callRequest.getAnswerDescription() != null) {
            call.setAnswerDescription(callRequest.getAnswerDescription());
        }
        callRepository.save(call);
    }

    @Override
    public Optional<Call> findById(String id) {
        return callRepository.findById(id);
    }

    @Override
    public void delete(String id) {
        callRepository.deleteById(id);
    }
}
