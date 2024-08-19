package com.example.interviewback.commons.response.interview;

import com.example.interviewback.commons.response.job.SimpleJobResponse;
import com.example.interviewback.commons.response.user.SimpleUserResponse;
import com.fasterxml.jackson.annotation.JsonFormat;
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
public class SimpleInterviewResponse {
    private Long interviewId;
    private String title;
    private List<SimpleUserResponse> interviewers;
    private String note;
    private String fileNote;
    @JsonFormat(pattern = "dd-MM-yyyy HH:mm")
    private LocalDateTime startTime;
    @JsonFormat(pattern = "dd-MM-yyyy HH:mm")
    private LocalDateTime endTime;
    private SimpleJobResponse job;
}
