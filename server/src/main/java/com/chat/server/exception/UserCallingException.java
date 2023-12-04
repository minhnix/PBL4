package com.chat.server.exception;

public class UserCallingException extends RuntimeException {
    public UserCallingException(String message) {
        super(message);
    }
}
