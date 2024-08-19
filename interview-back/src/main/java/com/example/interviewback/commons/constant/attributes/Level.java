package com.example.interviewback.commons.constant.attributes;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

import java.util.Arrays;
import java.util.List;

@RequiredArgsConstructor
@Getter
public enum Level {
    FRESHER("Fresher"),
    JUNIOR("Junior"),
    SENIOR("Senior"),
    LEADER("Leader"),
    MANAGER("Manager"),
    VICE_HEAD("Vice Head");

    private final String value;

    public static Level fromValue(String value) {
        return Arrays.stream(values())
                .filter(e -> e.getValue().equals(value))
                .findFirst()
                .orElse(FRESHER);
    }

    public static List<Level> getAll() {
        return Arrays.stream(values()).toList();
    }
}
