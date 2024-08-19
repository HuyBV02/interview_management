package com.example.interviewback.util;

import com.example.interviewback.commons.constant.attributes.ContractType;
import com.example.interviewback.commons.constant.attributes.Department;
import com.example.interviewback.commons.constant.attributes.Level;
import com.example.interviewback.commons.constant.attributes.Position;
import com.example.interviewback.commons.constant.status.OfferStatus;
import com.example.interviewback.commons.entity.candidate.Candidate;
import com.example.interviewback.commons.entity.interview.Interview;
import com.example.interviewback.commons.entity.offer.Offer;
import com.example.interviewback.commons.entity.user.User;
import com.example.interviewback.commons.request.offer.OfferRequest;
import com.example.interviewback.commons.response.candidate.SimpleCandidateResponse;
import com.example.interviewback.commons.response.interview.SimpleInterviewResponse;
import com.example.interviewback.commons.response.job.SimpleJobResponse;
import com.example.interviewback.commons.response.offer.OfferResponse;
import com.example.interviewback.commons.response.user.SimpleUserResponse;

import java.util.stream.Collectors;

public class OfferMapper {
    public static Offer toEntity(OfferRequest request) {
        return Offer.builder()
                .startContract(request.getStartContract())
                .endContract(request.getEndContract())
                .dueDate(request.getDueDate())
                .basicSalary(request.getBasicSalary())
                .note(request.getNote())
                .contractType(ContractType.valueOf(request.getContractType().toUpperCase()))
                .department(Department.valueOf(request.getDepartment().toUpperCase()))
                .position(Position.valueOf(request.getPosition().toUpperCase()))
                .level(Level.valueOf(request.getLevel().toUpperCase()))
                .candidate(Candidate.builder().candidateId(request.getCandidateId()).build())
                .approver(User.builder().userId(request.getApproverId()).build())
                .recruiter(User.builder().userId(request.getRecruiterId()).build())
                .interview(Interview.builder().interviewId(request.getInterviewId()).build())
                .isDeleted(false)
                .build();
    }

    public static Offer toEntity(Offer offer, OfferRequest request) {
        return offer
                .setStartContract(request.getStartContract())
                .setEndContract(request.getEndContract())
                .setDueDate(request.getDueDate())
                .setBasicSalary(request.getBasicSalary())
                .setNote(request.getNote())
                .setContractType(ContractType.valueOf(request.getContractType().toUpperCase()))
                .setDepartment(Department.valueOf(request.getDepartment().toUpperCase()))
                .setPosition(Position.valueOf(request.getPosition().toUpperCase()))
                .setLevel(Level.valueOf(request.getLevel().toUpperCase()))
                .setCandidate(Candidate.builder().candidateId(request.getCandidateId()).build())
                .setApprover(User.builder().userId(request.getApproverId()).build())
                .setRecruiter(User.builder().userId(request.getRecruiterId()).build())
                .setInterview(Interview.builder().interviewId(request.getInterviewId()).build())
                .setIsDeleted(false);
    }

    public static OfferResponse toResponse(Offer offer) {
        return OfferResponse.builder()
                .offerId(offer.getOfferId())
                .startContract(offer.getStartContract())
                .endContract(offer.getEndContract())
                .dueDate(offer.getDueDate())
                .basicSalary(offer.getBasicSalary())
                .note(offer.getNote())
                .contractType(offer.getContractType())
                .department(offer.getDepartment())
                .position(offer.getPosition())
                .level(offer.getLevel())
                .status(OfferStatus.fromCode(offer.getStatus()))
                .candidate(SimpleCandidateResponse.builder()
                        .candidateId(offer.getCandidate().getCandidateId())
                        .fullName(offer.getCandidate().getFullName())
                        .email(offer.getCandidate().getEmail())
                        .build())
                .approver(SimpleUserResponse.builder()
                        .userId(offer.getApprover().getUserId())
                        .fullName(offer.getApprover().getFullName())
                        .username(offer.getApprover().getUsername())
                        .build())
                .recruiter(SimpleUserResponse.builder()
                        .userId(offer.getRecruiter().getUserId())
                        .fullName(offer.getRecruiter().getFullName())
                        .username(offer.getRecruiter().getUsername())
                        .build())
                .interview(SimpleInterviewResponse.builder()
                        .interviewId(offer.getInterview().getInterviewId())
                        .title(offer.getInterview().getTitle())
                        .note(offer.getInterview().getNote())
                        .fileNote(offer.getInterview().getFileNote())
                        .job(SimpleJobResponse.builder()
                                .jobId(offer.getInterview().getJob().getJobId())
                                .department(offer.getInterview().getJob().getDepartment())
                                .build())
                        .interviewers(offer.getInterview().getScheduledInterviews().stream()
                                .map(s -> SimpleUserResponse.builder()
                                        .userId(s.getInterviewer().getUserId())
                                        .fullName(s.getInterviewer().getFullName())
                                        .username(s.getInterviewer().getUsername())
                                        .build())
                                .collect(Collectors.toList()))
                        .build())
                .build();
    }

    public static OfferResponse toSimpleResponse(Offer offer) {
        return OfferResponse.builder()
                .offerId(offer.getOfferId())
                .startContract(offer.getStartContract())
                .endContract(offer.getEndContract())
                .dueDate(offer.getDueDate())
                .basicSalary(offer.getBasicSalary())
                .note(offer.getNote())
                .contractType(offer.getContractType())
                .department(offer.getDepartment())
                .position(offer.getPosition())
                .level(offer.getLevel())
                .status(OfferStatus.fromCode(offer.getStatus()))
                .candidate(SimpleCandidateResponse.builder()
                        .candidateId(offer.getCandidate().getCandidateId())
                        .build())
                .approver(SimpleUserResponse.builder()
                        .userId(offer.getApprover().getUserId())
                        .build())
                .recruiter(SimpleUserResponse.builder()
                        .userId(offer.getRecruiter().getUserId())
                        .build())
                .interview(SimpleInterviewResponse.builder()
                        .interviewId(offer.getInterview().getInterviewId())
                        .note(offer.getInterview().getNote())
                        .build())
                .build();
    }
}
