package com.example.interviewback.commons.request.interview;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;

@Data
public class ScheduleRequest {
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate date;
}
