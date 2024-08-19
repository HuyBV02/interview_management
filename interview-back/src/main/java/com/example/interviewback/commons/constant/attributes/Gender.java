package com.example.interviewback.commons.constant.attributes;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

import java.util.Arrays;
import java.util.List;

@RequiredArgsConstructor
@Getter
public enum Gender {
    MALE("male"),
    FEMALE("female");

    private final String value;

    public static Gender fromValue(String value) {
        return Arrays.stream(values())
                .filter(e -> e.getValue().equals(value))
                .findFirst()
                .orElse(MALE);
    }

    public static List<Gender> getAll() {
        return Arrays.stream(values()).toList();
    }
}
