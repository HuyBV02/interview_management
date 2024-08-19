package com.example.interviewback.util;

import com.example.interviewback.commons.constant.attributes.Gender;
import com.example.interviewback.commons.constant.attributes.HighestLevel;
import com.example.interviewback.commons.constant.attributes.Position;
import com.example.interviewback.commons.constant.attributes.Skill;
import com.example.interviewback.commons.constant.status.CandidateStatus;
import com.example.interviewback.commons.entity.candidate.Candidate;
import com.example.interviewback.commons.entity.user.User;
import com.example.interviewback.commons.request.candidate.CandidateRequest;
import com.example.interviewback.commons.response.candidate.CandidateResponse;
import com.example.interviewback.commons.response.user.SimpleUserResponse;

import java.util.Arrays;
import java.util.stream.Collectors;

public class CandidateMapper {
    public static Candidate toEntity(CandidateRequest request) {
        return Candidate.builder()
                .fullName(request.getFullName())
                .dob(request.getDob())
                .email(request.getEmail())
                .address(request.getAddress())
                .phoneNumber(request.getPhoneNumber())
                .yearOfExp(request.getYearOfExp())
                .cv(request.getCv())
                .note(request.getNote())
                .gender(Gender.valueOf(request.getGender().toUpperCase()))
                .skills(request.getSkills().stream().map(s -> Skill.valueOf(s.toUpperCase()).getValue())
                        .collect(Collectors.joining(", ")))
                .highestLevel(HighestLevel.valueOf(request.getHighestLevel().toUpperCase()))
                .position(Position.valueOf(request.getPosition().toUpperCase()))
                .recruiter(User.builder().userId(request.getRecruiterId()).build())
                .isDeleted(false)
                .build();
    }

    public static Candidate toEntity(Candidate candidate, CandidateRequest request) {
        return candidate
                .setFullName(request.getFullName())
                .setDob(request.getDob())
                .setEmail(request.getEmail())
                .setAddress(request.getAddress())
                .setPhoneNumber(request.getPhoneNumber())
                .setYearOfExp(request.getYearOfExp())
                .setCv(request.getCv())
                .setNote(request.getNote())
                .setGender(Gender.valueOf(request.getGender().toUpperCase()))
                .setSkills(request.getSkills().stream().map(s -> Skill.valueOf(s.toUpperCase()).getValue())
                        .collect(Collectors.joining(", ")))
                .setHighestLevel(HighestLevel.valueOf(request.getHighestLevel().toUpperCase()))
                .setPosition(Position.valueOf(request.getPosition().toUpperCase()))
                .setRecruiter(User.builder().userId(request.getRecruiterId()).build())
                .setIsDeleted(false);
    }

    public static CandidateResponse toResponse(Candidate candidate) {
        return CandidateResponse.builder()
                .candidateId(candidate.getCandidateId())
                .fullName(candidate.getFullName())
                .dob(candidate.getDob())
                .email(candidate.getEmail())
                .address(candidate.getAddress())
                .phoneNumber(candidate.getPhoneNumber())
                .yearOfExp(candidate.getYearOfExp())
                .cv(candidate.getCv())
                .note(candidate.getNote())
                .gender(candidate.getGender())
                .status(CandidateStatus.fromCode(candidate.getStatus()))
                .skills(Arrays.stream(candidate.getSkills().split(", ")).map(Skill::fromValue).collect(Collectors.toList()))
                .highestLevel(candidate.getHighestLevel())
                .position(candidate.getPosition())
                .recruiter(SimpleUserResponse.builder()
                        .userId(candidate.getRecruiter().getUserId())
                        .fullName(candidate.getRecruiter().getFullName())
                        .username(candidate.getRecruiter().getUsername())
                        .build())
                .jobs(candidate.getCandidateJobs().stream()
                        .filter(candidateJob -> candidateJob.getJob().getIsDeleted() == null ||
                                !candidateJob.getJob().getIsDeleted())
                        .map(candidateJob -> JobMapper.toResponse(candidateJob.getJob()).setCv(candidateJob.getCv()))
                        .collect(Collectors.toList()))
                .build();
    }
}
