package com.example.interviewback.commons.constant.status;

import com.example.interviewback.commons.constant.IEnum;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

import java.util.Arrays;
import java.util.List;
import java.util.Objects;

@RequiredArgsConstructor
@Getter
public enum OfferStatus implements IEnum {
    WAITING_FOR_APPROVAL(1, "waiting for approval"),
    APPROVED(3, "approved"),
    REJECTED(4, "rejected"),
    WAITING_FOR_RESPONSE(2, "waiting for response"),
    ACCEPTED_OFFER(5, "accepted"),
    DECLINED_OFFER(6, "declined offer"),
    CANCELLED(7, "cancelled");

    private final Integer code;
    private final String value;

    public static OfferStatus fromCode(Integer code) {
        return Arrays.stream(values())
                .filter(e -> Objects.equals(e.getCode(), code))
                .findFirst()
                .orElse(WAITING_FOR_APPROVAL);
    }

    public static OfferStatus fromValue(String value) {
        return Arrays.stream(values())
                .filter(e -> e.getValue().equalsIgnoreCase(value))
                .findFirst()
                .orElse(WAITING_FOR_APPROVAL);
    }

    public static List<Integer> findContain(String search) {
        return Arrays.stream(values())
                .filter(e -> e.getValue().toLowerCase().contains(search.toLowerCase()))
                .map(OfferStatus::getCode)
                .toList();
    }

//    public static List<OfferStatus> getAll() {
//        return Arrays.stream(values()).toList();
//    }
}
