package com.example.interviewback.commons.response.interview;

import com.example.interviewback.commons.constant.attributes.Result;
import com.example.interviewback.commons.constant.status.InterviewStatus;
import com.example.interviewback.commons.response.user.SimpleUserResponse;
import com.example.interviewback.commons.response.candidate.SimpleCandidateResponse;
import com.example.interviewback.commons.response.job.SimpleJobResponse;
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
public class InterviewResponse {
    private Long interviewId;
    private String title;
    @JsonFormat(pattern = "dd-MM-yyyy HH:mm")
    private LocalDateTime startTime;
    @JsonFormat(pattern = "dd-MM-yyyy HH:mm")
    private LocalDateTime endTime;
    private String note;
    private String location;
    private String meetingId;
    private InterviewStatus status;
    private Result result;
    private String fileNote;

    private SimpleCandidateResponse candidate;
    private SimpleJobResponse job;
    private SimpleUserResponse recruit;
    private List<SimpleUserResponse> interviewers;
}
