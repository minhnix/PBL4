package com.chat.server.payload.request;

import com.chat.server.model.CallUserInfo;
import lombok.Getter;
import lombok.Setter;
import org.bson.Document;

import java.util.List;

@Getter
@Setter
public class CallRequest {
    private String callId;
    private String channelId;
    private Document offerCandidate;
    private Document answerCandidate;
    private Document offerDescription;
    private Document answerDescription;
    private Document signal;
    private CallUserInfo info;
    private List<CallUserInfo> infos;
}
