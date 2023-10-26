package com.chat.server.payload.response;

import com.chat.server.model.User;
import com.chat.server.model.UserWithUsername;
import com.chat.server.payload.request.ChatMessage;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

import java.time.Instant;
import java.util.List;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor(access = AccessLevel.PRIVATE)
public class ChannelMessage {
    @JsonProperty("channelId")
    private String _id;
    private String channelName;
    private String type;
    private UserWithUsername sender;
    private String latestMessage;
    private ChatMessage.Type messageType;
    private Instant createdAt;
    private boolean isOnline;
    private String userId;
    @JsonIgnore
    private List<User> userInfos;
}
