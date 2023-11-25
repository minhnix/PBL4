package com.chat.server.payload.request;

import com.chat.server.model.UserWithUsername;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CallMessage {
    public enum Type {
        CREATE,
        JOIN,
        MESSAGE,
        CANCEL,
        CALL,
        ACCEPT,
        LEAVE,
        TOGGLE_CAM,
        TOGGLE_MIC
    }
    private Type type;
    private String sendTo;
    private UserWithUsername sender;
    private CallRequest payload;
}
