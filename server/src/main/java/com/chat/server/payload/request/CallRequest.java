package com.chat.server.payload.request;

import lombok.Getter;
import lombok.Setter;
import org.bson.Document;

@Getter
@Setter
public class CallRequest {
    private String callId;
    private String channelId;
    private Document offerCandidate;
    private Document answerCandidate;
    private Document offerDescription;
    private Document answerDescription;
}
