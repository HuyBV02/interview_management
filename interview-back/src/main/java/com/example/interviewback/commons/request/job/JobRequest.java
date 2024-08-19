package com.example.interviewback.commons.request.job;

import com.example.interviewback.config.annotion.ValidDateRange;
import com.example.interviewback.config.annotion.ValidSalaryRange;
import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@ValidDateRange(startDateField = "startDate", endDateField = "endDate")
@ValidSalaryRange
public class JobRequest {
    @NotBlank(message = "Job title is required!")
    private String title;

    @JsonFormat(pattern = "dd-MM-yyyy")
    @NotNull(message = "Start date is required!")
    @FutureOrPresent(message = "Start date must be in the present or future!")
    private LocalDate startDate;

    @JsonFormat(pattern = "dd-MM-yyyy")
    @NotNull(message = "End date is required!")
    @Future(message = "End date must be in the future!")
    private LocalDate endDate;

    @NotNull(message = "Salary from is required!")
    @Positive(message = "Salary from must be positive!")
    private Double salaryFrom;

    @NotNull(message = "Salary to is required!")
    @Positive(message = "Salary to must be positive!")
    private Double salaryTo;

    private String workingAddress;
    private String description;

    @NotEmpty(message = "Skills are required!")
    private List<String> skills;

    @NotEmpty(message = "Benefits are required!")
    private List<String> benefits;

    @NotEmpty(message = "Levels are required!")
    private List<String> levels;
    private String department = "IT";
}
