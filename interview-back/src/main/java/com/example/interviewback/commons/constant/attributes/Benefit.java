package com.example.interviewback.commons.constant.attributes;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

import java.util.Arrays;
import java.util.List;

@RequiredArgsConstructor
@Getter
public enum Benefit {
    LUNCH("Lunch"),
    LEAVE("25-day leave"),
    HEALTH("Healthcare Insurance"),
    WORKING("Hybrid Working"),
    TRAVEL("Travel");

    private final String value;

    public static Benefit fromValue(String value) {
        return Arrays.stream(values())
                .filter(e -> e.getValue().equals(value))
                .findFirst()
                .orElse(LUNCH);
    }

    public static List<Benefit> getAll() {
        return Arrays.stream(values()).toList();
    }
}
