package com.example.interviewback.util;

import com.example.interviewback.commons.constant.attributes.Level;
import com.example.interviewback.commons.constant.status.InterviewStatus;
import com.example.interviewback.commons.entity.candidate.Candidate;
import com.example.interviewback.commons.entity.interview.Interview;
import com.example.interviewback.commons.entity.job.Job;
import com.example.interviewback.commons.entity.user.User;
import com.example.interviewback.commons.request.interview.InterviewRequest;
import com.example.interviewback.commons.response.candidate.SimpleCandidateResponse;
import com.example.interviewback.commons.response.interview.InterviewResponse;
import com.example.interviewback.commons.response.job.SimpleJobResponse;
import com.example.interviewback.commons.response.user.SimpleUserResponse;

import java.util.Arrays;
import java.util.stream.Collectors;

public class InterviewMapper {
    public static Interview toEntity(InterviewRequest request) {
        return Interview.builder()
                .title(request.getTitle())
                .startTime(request.getStartTime())
                .endTime(request.getEndTime())
                .note(request.getNote())
                .location(request.getLocation())
                .meetingId(request.getMeetingId())
                .fileNote(request.getFileNote())
                .candidate(Candidate.builder().candidateId(request.getCandidateId()).build())
                .job(Job.builder().jobId(request.getJobId()).build())
                .recruit(User.builder().userId(request.getRecruiterId()).build())
                .isDeleted(false)
                .build();
    }

    public static Interview toEntity(Interview interview, InterviewRequest request) {
        return interview
                .setInterviewId(interview.getInterviewId())
                .setTitle(request.getTitle())
                .setStartTime(request.getStartTime())
                .setEndTime(request.getEndTime())
                .setNote(request.getNote())
                .setLocation(request.getLocation())
                .setMeetingId(request.getMeetingId())
                .setFileNote(request.getFileNote())
                .setCandidate(Candidate.builder().candidateId(request.getCandidateId()).build())
                .setJob(Job.builder().jobId(request.getJobId()).build())
                .setRecruit(User.builder().userId(request.getRecruiterId()).build())
                .setIsDeleted(false);
    }

    public static InterviewResponse toResponse(Interview interview) {
        return InterviewResponse.builder()
                .interviewId(interview.getInterviewId())
                .title(interview.getTitle())
                .startTime(interview.getStartTime())
                .endTime(interview.getEndTime())
                .note(interview.getNote())
                .location(interview.getLocation())
                .meetingId(interview.getMeetingId())
                .status(InterviewStatus.fromCode(interview.getStatus()))
                .result(interview.getResult())
                .fileNote(interview.getFileNote())
                .candidate(SimpleCandidateResponse.builder()
                        .candidateId(interview.getCandidate().getCandidateId())
                        .fullName(interview.getCandidate().getFullName())
                        .position(interview.getCandidate().getPosition())
                        .build())
                .job(SimpleJobResponse.builder()
                        .jobId(interview.getJob().getJobId())
                        .title(interview.getJob().getTitle())
                        .levels(interview.getJob().getLevels() != null
                                ? Arrays.stream(interview.getJob().getLevels().split(", ")).map(Level::fromValue).collect(Collectors.toList())
                                : null)
                        .department(interview.getJob().getDepartment())
                        .build())
                .recruit(SimpleUserResponse.builder()
                        .userId(interview.getRecruit().getUserId())
                        .fullName(interview.getRecruit().getFullName())
                        .username(interview.getRecruit().getUsername())
                        .build())
                .interviewers(interview.getScheduledInterviews().stream()
                        .map(s -> SimpleUserResponse.builder()
                                .userId(s.getInterviewer().getUserId())
                                .fullName(s.getInterviewer().getFullName())
                                .username(s.getInterviewer().getUsername())
                                .build())
                        .collect(Collectors.toList()))
                .build();
    }
}
