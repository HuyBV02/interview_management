package com.example.interviewback.commons.constant.attributes;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

import java.util.Arrays;
import java.util.List;

@RequiredArgsConstructor
@Getter
public enum Department {
    IT("IT"),
    HR("HR"),
    FINANCE("Finance"),
    COMMUNICATION("Communication"),
    MARKETING("Marketing"),
    ACCOUNTING("Accounting");

    private final String value;

    public static Department fromValue(String value) {
        return Arrays.stream(values())
                .filter(e -> e.getValue().equals(value))
                .findFirst()
                .orElse(IT);
    }

    public static List<Department> getAll() {
        return Arrays.stream(values()).toList();
    }
}
