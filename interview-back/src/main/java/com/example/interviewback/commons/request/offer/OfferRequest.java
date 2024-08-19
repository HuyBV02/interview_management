package com.example.interviewback.commons.request.offer;

import com.example.interviewback.config.annotion.ValidDateRange;
import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@ValidDateRange(startDateField = "startContract", endDateField = "endContract")
public class OfferRequest {
    @JsonFormat(pattern = "dd-MM-yyyy")
    @FutureOrPresent(message = "Start contract date must be in the future!")
    private LocalDate startContract;

    @JsonFormat(pattern = "dd-MM-yyyy")
    @FutureOrPresent(message = "End contract date must be in the future!")
    private LocalDate endContract;

    @JsonFormat(pattern = "dd-MM-yyyy")
    @FutureOrPresent(message = "Due date must be in the future!")
    private LocalDate dueDate;

    @NotNull(message = "Basic salary is required!")
    @Positive(message = "Basic salary must be positive!")
    private Double basicSalary;

    private String note;

    @NotBlank(message = "Contract Type is required!")
    private String contractType;

    @NotBlank(message = "Department is required!")
    private String department;

    @NotBlank(message = "Position is required!")
    private String position;

    @NotBlank(message = "Level is required!")
    private String level;

    @NotNull(message = "Candidate ID is required!")
    private Long candidateId;

    @NotNull(message = "Approver ID is required!")
    private Long approverId;

    @NotNull(message = "Recruiter ID is required!")
    private Long recruiterId;

    @NotNull(message = "Interview ID is required!")
    private Long interviewId;
}
