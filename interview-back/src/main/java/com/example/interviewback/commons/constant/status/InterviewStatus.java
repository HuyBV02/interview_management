package com.example.interviewback.commons.constant.status;

import com.example.interviewback.commons.constant.IEnum;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

import java.util.Arrays;
import java.util.List;
import java.util.Objects;

@RequiredArgsConstructor
@Getter
public enum InterviewStatus implements IEnum {
    NEW(1, "new"),
    INVITED(2, "invited"),
    INTERVIEWED(3, "interviewed"),
    CANCELLED(4, "cancelled");

    private final Integer code;
    private final String value;

    public static InterviewStatus fromCode(Integer code) {
        return Arrays.stream(values())
                .filter(e -> Objects.equals(e.getCode(), code))
                .findFirst()
                .orElse(NEW);
    }

    public static InterviewStatus fromValue(String value) {
        return Arrays.stream(values())
                .filter(e -> e.getValue().equalsIgnoreCase(value))
                .findFirst()
                .orElse(NEW);
    }

    public static List<Integer> findContain(String search) {
        return Arrays.stream(values())
                .filter(e -> e.getValue().toLowerCase().contains(search.toLowerCase()))
                .map(InterviewStatus::getCode)
                .toList();
    }

//    public static List<InterviewStatus> getAll() {
//        return Arrays.stream(values()).toList();
//    }
}
