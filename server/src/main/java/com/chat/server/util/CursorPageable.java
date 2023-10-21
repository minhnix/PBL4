package com.chat.server.util;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CursorPageable<TC> {
    private int size;
    private TC previousCursor;
    private TC nextCursor;
    private String columnName;
    public boolean hasPreviousCursor() {
        return previousCursor != null;
    }
    public boolean hasNextCursor() {
        return nextCursor != null;
    }
}
