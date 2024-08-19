package com.example.interviewback.commons.constant.attributes;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

import java.util.Arrays;
import java.util.List;

@RequiredArgsConstructor
@Getter
public enum ContractType {
    TRIAL("Trial 2 months"),
    TRAINEE("Trainee 3 months"),
    ONE_YEAR("1 year"),
    THREE_YEAR("3 years"),
    UNLIMITED("Unlimited");

    private final String value;

    public static ContractType fromValue(String value) {
        return Arrays.stream(values())
                .filter(e -> e.getValue().equals(value))
                .findFirst()
                .orElse(TRIAL);
    }

    public static List<ContractType> getAll() {
        return Arrays.stream(values()).toList();
    }
}
