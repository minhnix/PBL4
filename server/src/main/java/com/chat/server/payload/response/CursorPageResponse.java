package com.chat.server.payload.response;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class CursorPageResponse<T, TC> {
    private List<T> data;
    private TC previousCursor;
    private TC nextCursor;
}
