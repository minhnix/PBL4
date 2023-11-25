package com.chat.server.model;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class CallUserInfo {
    private String userId;
    private String userName;
    private boolean isEnableVideo;
    private boolean isEnableAudio;
}
