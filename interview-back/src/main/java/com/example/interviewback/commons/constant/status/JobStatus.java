package com.example.interviewback.commons.constant.status;

import com.example.interviewback.commons.constant.IEnum;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

import java.util.*;

@RequiredArgsConstructor
@Getter
public enum JobStatus implements IEnum {
    DRAFT(2, "draft"),
    OPEN(1, "open"),
    CLOSED(3, "closed");

    private final Integer code;
    private final String value;

    public static JobStatus fromCode(Integer code) {
        return Arrays.stream(values())
                .filter(e -> Objects.equals(e.getCode(), code))
                .findFirst()
                .orElse(OPEN);
    }

    public static JobStatus fromValue(String value) {
        return Arrays.stream(values())
                .filter(e -> e.getValue().equalsIgnoreCase(value))
                .findFirst()
                .orElse(OPEN);
    }

    public static List<Integer> findContain(String search) {
        return Arrays.stream(values())
                .filter(e -> e.getValue().toLowerCase().contains(search.toLowerCase()))
                .map(JobStatus::getCode)
                .toList();
    }

//    public static List<JobStatus> getAll() {
//        return Arrays.stream(values()).toList();
//    }
}
