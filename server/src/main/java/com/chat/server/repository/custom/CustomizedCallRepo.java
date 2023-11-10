package com.chat.server.repository.custom;

import com.chat.server.model.Call;
import org.bson.Document;

public interface CustomizedCallRepo {
    boolean isUserCalling(String userId, String channelId);
    void addOfferCandidate(String callId, Document offer);
    void addAnswerCandidate(String callId, Document answer);
    Call findByUserAndNotCallId(String userId, String callId);
}