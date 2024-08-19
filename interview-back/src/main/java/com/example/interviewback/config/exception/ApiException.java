package com.example.interviewback.config.exception;

public class ApiException extends RuntimeException {
    private final int code;
    private final String message;

    public ApiException(int code, String message) {
        this.code = code;
        this.message = message;
    }

    public int getCode() {
        return code;
    }

    @Override
    public String getMessage() {
        return message;
    }
}
