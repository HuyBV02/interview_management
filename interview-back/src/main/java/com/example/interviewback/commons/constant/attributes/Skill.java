package com.example.interviewback.commons.constant.attributes;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

import java.util.Arrays;
import java.util.List;

@RequiredArgsConstructor
@Getter
public enum Skill {
    JAVA("Java"),
    NODEJS("Nodejs"),
    DOTNET(".net"),
    CPP("CPP"),
    BA("Business Analyst"),
    COMMUNICATION("communication");

    private final String value;

    public static Skill fromValue(String value) {
        return Arrays.stream(values())
                .filter(e -> e.getValue().equals(value))
                .findFirst()
                .orElse(JAVA);
    }

    public static List<Skill> getAll() {
        return Arrays.stream(values()).toList();
    }
}
