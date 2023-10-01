package com.chat.server.util;



import com.chat.server.exception.BadRequestException;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class ValidateDate {
    public static void invoke(LocalDate start, LocalDate end) {
        if (start.isAfter(end)) {
            throw new BadRequestException("Thời gian không hợp lệ");
        }
    }
    public static void invoke(LocalDateTime start, LocalDateTime end) {
        if (start.isAfter(end)) {
            throw new BadRequestException("Thời gian không hợp lệ");
        }
    }
}
