package com.example.interviewback.commons.response;

import lombok.Builder;
import lombok.Data;

import static org.springframework.http.HttpStatus.OK;

@Data
@Builder
public class DfResponse<T> {
    private int code;
    private String message;
    private T data;

    public static <T> DfResponse<T> ok(T data) {
        return DfResponse.<T>builder()
                .code(OK.value())
                .message(OK.getReasonPhrase())
                .data(data)
                .build();
    }

    public static <T> DfResponse<T> error(int code, String message) {
        return DfResponse.<T>builder()
                .code(code)
                .message(message)
                .build();
    }
}
