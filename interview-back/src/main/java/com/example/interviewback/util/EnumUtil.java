package com.example.interviewback.util;

import com.example.interviewback.commons.constant.IEnum;

import java.util.*;
import java.util.stream.Collectors;

public class EnumUtil {

    public static <E extends Enum<E> & IEnum> List<Map<String, Object>> getAll(Class<E> enumClass) {
        return Arrays.stream(enumClass.getEnumConstants())
                .map(e -> {
                    Map<String, Object> map = new HashMap<>();
                    map.put("code", e.getCode());
                    map.put("status", e.getValue().toUpperCase());
                    return map;
                })
                .collect(Collectors.toList());
    }

    public static <E extends Enum<E> & IEnum> List<E> getAllValues(Class<E> enumClass) {
        return Arrays.stream(enumClass.getEnumConstants()).toList();
    }
}
