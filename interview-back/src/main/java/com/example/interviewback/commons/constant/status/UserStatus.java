package com.example.interviewback.commons.constant.status;

import com.example.interviewback.commons.constant.IEnum;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

import java.util.Arrays;
import java.util.List;
import java.util.Objects;

@RequiredArgsConstructor
@Getter
public enum UserStatus implements IEnum {
    ACTIVE(1, "active"),
    INACTIVE(2, "inactive");

    private final Integer code;
    private final String value;

    public static UserStatus fromCode(Integer code) {
        return Arrays.stream(values())
                .filter(e -> Objects.equals(e.getCode(), code))
                .findFirst()
                .orElse(ACTIVE);
    }

    public static UserStatus fromValue(String value) {
        return Arrays.stream(values())
                .filter(e -> e.getValue().equalsIgnoreCase(value))
                .findFirst()
                .orElse(ACTIVE);
    }

    public static List<Integer> findContain(String search) {
        return Arrays.stream(values())
                .filter(e -> e.getValue().toLowerCase().contains(search.toLowerCase()))
                .map(UserStatus::getCode)
                .toList();
    }

//    public static List<UserStatus> getAll() {
//        return Arrays.stream(values()).toList();
//    }
}
