package com.example.interviewback.commons.constant.attributes;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

import java.util.Arrays;
import java.util.List;

@RequiredArgsConstructor
@Getter
public enum HighestLevel {
    HIGH_SCHOOL("High School"),
    BACHELOR("Bachelor's Degree"),
    MASTER("Master Degree, PhD");

    private final String value;

    public static HighestLevel fromValue(String value) {
        return Arrays.stream(values())
                .filter(e -> e.getValue().equals(value))
                .findFirst()
                .orElse(HIGH_SCHOOL);
    }

    public static List<HighestLevel> getAll() {
        return Arrays.stream(values()).toList();
    }
}
