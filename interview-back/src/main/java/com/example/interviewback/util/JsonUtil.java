package com.example.interviewback.util;

import com.google.gson.Gson;

public class JsonUtil {
    private static final Gson gson = new Gson();

    public static String objectToJson(Object o) {
        return gson.toJson(o);
    }

    public static <T> T jsonToObject(String json, Class<T> tClass) {
        return gson.fromJson(json, tClass);
    }
}
