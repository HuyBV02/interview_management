package com.example.interviewback.commons.response.offer;

import com.example.interviewback.commons.constant.attributes.ContractType;
import com.example.interviewback.commons.constant.attributes.Department;
import com.example.interviewback.commons.constant.attributes.Level;
import com.example.interviewback.commons.constant.attributes.Position;
import com.example.interviewback.commons.constant.status.OfferStatus;
import com.example.interviewback.commons.response.candidate.SimpleCandidateResponse;
import com.example.interviewback.commons.response.interview.SimpleInterviewResponse;
import com.example.interviewback.commons.response.user.SimpleUserResponse;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OfferResponse {
    private Long offerId;
    @JsonFormat(pattern = "dd-MM-yyyy")
    private LocalDate startContract;
    @JsonFormat(pattern = "dd-MM-yyyy")
    private LocalDate endContract;
    @JsonFormat(pattern = "dd-MM-yyyy")
    private LocalDate dueDate;
    private Double basicSalary;
    private String note;
    private ContractType contractType;
    private Department department;
    private Position position;
    private Level level;
    private OfferStatus status;

    private SimpleCandidateResponse candidate;
    private SimpleUserResponse approver;
    private SimpleUserResponse recruiter;
    private SimpleInterviewResponse interview;
}
