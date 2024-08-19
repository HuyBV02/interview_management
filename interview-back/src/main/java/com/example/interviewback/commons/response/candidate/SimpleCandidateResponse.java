package com.example.interviewback.commons.response.candidate;

import com.example.interviewback.commons.constant.attributes.Position;
import com.example.interviewback.commons.response.job.SimpleJobResponse;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SimpleCandidateResponse {
    private Long candidateId;
    private String fullName;
    private String email;
    private List<SimpleJobResponse> jobs;
    private Position position;
}
