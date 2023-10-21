package com.chat.server.payload.response;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SearchChannelResponse {
    private String channelId;
    private String channelName;
    private String type;
    private boolean isOnline = true;
    private String userId;
}
