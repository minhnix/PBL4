package com.chat.server.payload.request;

import lombok.*;
import org.bson.types.ObjectId;

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
    private Set<ObjectId> users;
}
