package com.example.interviewback.commons.constant.attributes;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

import java.util.Arrays;
import java.util.List;

@RequiredArgsConstructor
@Getter
public enum Result {
    PASSED("PASSED"),
    FAILED("FAILED");

    private final String value;

    public static Result fromValue(String value) {
        return Arrays.stream(values())
                .filter(e -> e.getValue().equals(value))
                .findFirst()
                .orElse(FAILED);
    }

    public static List<Result> getAll() {
        return Arrays.stream(values()).toList();
    }
}
