package com.example.interviewback.commons.constant.attributes;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

import java.util.Arrays;
import java.util.List;

@RequiredArgsConstructor
@Getter
public enum Position {
    BE("Backend Developer"),
    BA("Business Analyst"),
    TESTER("Tester"),
    HR("HR"),
    PM("Project Manager"),
    NA("Not Available");

    private final String value;

    public static Position fromValue(String value) {
        return Arrays.stream(values())
                .filter(e -> e.getValue().equals(value))
                .findFirst()
                .orElse(BE);
    }

    public static List<Position> getAll() {
        return Arrays.stream(values()).toList();
    }
}
