package com.chat.server.payload.request;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Set;

@Getter
@Setter
@Builder
@AllArgsConstructor
@ToString
@NoArgsConstructor
public class ChannelRequest {
    private String type;
    private String name;
    private Set<String> users;
}
