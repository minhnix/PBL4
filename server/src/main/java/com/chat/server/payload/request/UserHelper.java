package com.chat.server.payload.request;

import lombok.*;

@Getter
@Setter
@Builder
@AllArgsConstructor
@ToString
@NoArgsConstructor
public class UserHelper {
    private String idChannel;
    private String idUser;
}
