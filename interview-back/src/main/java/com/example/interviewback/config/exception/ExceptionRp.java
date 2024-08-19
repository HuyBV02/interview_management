package com.example.interviewback.config.exception;

import com.example.interviewback.commons.response.DfResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class ExceptionRp {
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ExceptionHandler(ApiException.class)
    public static DfResponse<?> handleApiException(ApiException e) {
        return DfResponse.builder()
                .code(e.getCode())
                .message(e.getMessage())
                .data(null)
                .build();
    }

    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public DfResponse<Object> handleValidationExceptions(MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getFieldErrors().forEach(error ->
                errors.put(error.getField(), error.getDefaultMessage()));
        return DfResponse.builder()
                .code(HttpStatus.BAD_REQUEST.value())
                .message("Validation failed!")
                .data(errors)
                .build();
    }

    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ExceptionHandler(IllegalArgumentException.class)
    public DfResponse<Object> handleValidationExceptions(IllegalArgumentException ex) {
        return DfResponse.builder()
                .code(HttpStatus.BAD_REQUEST.value())
                .message("Validation failed!")
                .data("Please fill in the correct format!")
                .build();
    }

    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ExceptionHandler(HttpMessageNotReadableException.class)
    public DfResponse<Object> handleNotReadableExceptions(HttpMessageNotReadableException ex) {
        return DfResponse.builder()
                .code(HttpStatus.BAD_REQUEST.value())
                .message("Validation failed!")
                .data("Please fill in the correct format!")
                .build();
    }

}
