package com.example.interviewback.commons.response.mail;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CandidateMail {
    private Long candidateId;
    private String fullName;
    private String email;
    private String note;
    private String recruiter;
}
