package com.example.interviewback.commons.constant.status;

import com.example.interviewback.commons.constant.IEnum;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

import java.util.*;

@RequiredArgsConstructor
@Getter
public enum CandidateStatus implements IEnum {
    OPEN(4, "open"),
    BANNED(13, "banned"),
    WAITING_FOR_INTERVIEW(1, "waiting for interview"),
    CANCELLED_INTERVIEW(12, "cancelled interview"),
    PASSED_INTERVIEW(5, "passed interview"),
    FAILED_INTERVIEW(11, "failed interview"),
    WAITING_FOR_APPROVAL(2, "waiting for approval"),
    APPROVED_OFFER(6, "approved offer"),
    REJECTED_OFFER(7, "rejected offer"),
    WAITING_FOR_RESPONSE(3, "waiting for response"),
    ACCEPT_OFFER(8, "accept offer"),
    DECLINED_OFFER(9, "declined offer"),
    CANCELLED_OFFER(10, "cancelled offer");

    private final Integer code;
    private final String value;

    public static CandidateStatus fromCode(Integer code) {
        return Arrays.stream(values())
                .filter(e -> Objects.equals(e.getCode(), code))
                .findFirst()
                .orElse(OPEN);
    }

    public static CandidateStatus fromValue(String value) {
        return Arrays.stream(values())
                .filter(e -> e.getValue().equalsIgnoreCase(value))
                .findFirst()
                .orElse(OPEN);
    }

    public static List<Integer> findContain(String search) {
        return Arrays.stream(values())
                .filter(e -> e.getValue().toLowerCase().contains(search.toLowerCase()))
                .map(CandidateStatus::getCode)
                .toList();
    }

//    public static List<CandidateStatus> getAll() {
//        return Arrays.stream(values()).toList();
//    }
}
