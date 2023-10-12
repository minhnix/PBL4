package com.chat.server.util;

import java.time.Instant;

public class TimeConvert {
    public static Instant convert(Double time) {
        if (time == null) return null;
        try {
            return Instant.ofEpochMilli((long) (time * 1000));
        } catch (Exception e) {
            System.out.println("Error parsing the date string: " + e.getMessage());
        }
        return null;
    }
}
