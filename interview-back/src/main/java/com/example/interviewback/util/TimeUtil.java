package com.example.interviewback.util;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

public class TimeUtil {
    private final static DateTimeFormatter dateFormat = DateTimeFormatter.ofPattern("dd/MM/yyyy");
    private final static DateTimeFormatter timeFormat = DateTimeFormatter.ofPattern("HH:mm");

    public static String dateTimeToDateString(LocalDateTime localDateTime) {
        return localDateTime.format(dateFormat);
    }

    public static String dateTimeToTimeString(LocalDateTime localDateTime) {
        return localDateTime.format(timeFormat);
    }

    public static String dateToDateString(LocalDate localDate) {
        return localDate.format(dateFormat);
    }

    public static LocalDate getPreviousSunday(LocalDate date) {
        LocalDate previousSunday = date;
        while (previousSunday.getDayOfWeek() != DayOfWeek.SUNDAY) {
            previousSunday = previousSunday.minusDays(1);
        }
        return previousSunday;
    }

    public static LocalDate getNextSaturday(LocalDate date) {
        LocalDate nextSaturday = date;
        while (nextSaturday.getDayOfWeek() != DayOfWeek.SATURDAY) {
            nextSaturday = nextSaturday.plusDays(1);
        }
        return nextSaturday;
    }
}
