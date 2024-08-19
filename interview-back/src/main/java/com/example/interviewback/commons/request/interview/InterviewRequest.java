package com.example.interviewback.commons.request.interview;

import com.example.interviewback.config.annotion.ValidDateRange;
import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@ValidDateRange(startDateField = "startTime", endDateField = "endTime")
public class InterviewRequest {
    @NotBlank(message = "Interview title is required!")
    private String title;

    @JsonFormat(pattern = "dd-MM-yyyy HH:mm")
    @NotNull(message = "Start time is required!")
    @Future(message = "Start time must be in the future!")
    private LocalDateTime startTime;

    @JsonFormat(pattern = "dd-MM-yyyy HH:mm")
    @NotNull(message = "End time is required!")
    @Future(message = "End time must be in the future!")
    private LocalDateTime endTime;
    private String note;
    private String location;
    private String meetingId;

    @NotNull(message = "Candidate ID are required!")
    private Long candidateId;

    @NotNull(message = "Job ID are required!")
    private Long jobId;

    @NotNull(message = "Recruiter ID are required!")
    private Long recruiterId;

    @NotEmpty(message = "Interviewer IDs are required!")
    private List<Long> interviewerIds;
    private String fileNote;

    private Long interviewId;
}
