package com.example.interviewback.util;

import com.example.interviewback.commons.constant.attributes.Benefit;
import com.example.interviewback.commons.constant.attributes.Department;
import com.example.interviewback.commons.constant.attributes.Level;
import com.example.interviewback.commons.constant.attributes.Skill;
import com.example.interviewback.commons.constant.status.JobStatus;
import com.example.interviewback.commons.entity.job.Job;
import com.example.interviewback.commons.request.job.JobRequest;
import com.example.interviewback.commons.response.job.JobResponse;

import java.util.Arrays;
import java.util.stream.Collectors;

public class JobMapper {
    public static Job toEntity(JobRequest request) {
        return Job.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .startDate(request.getStartDate())
                .endDate(request.getEndDate())
                .salaryFrom(request.getSalaryFrom())
                .salaryTo(request.getSalaryTo())
                .workingAddress(request.getWorkingAddress())
                .skills(request.getSkills().stream().map(s -> Skill.valueOf(s.toUpperCase()).getValue())
                        .collect(Collectors.joining(", ")))
                .benefits(request.getBenefits().stream().map(b -> Benefit.valueOf(b.toUpperCase()).getValue())
                        .collect(Collectors.joining(", ")))
                .levels(request.getLevels().stream().map(l -> Level.valueOf(l.toUpperCase()).getValue())
                        .collect(Collectors.joining(", ")))
                .department(Department.valueOf(request.getDepartment().toUpperCase()))
                .isDeleted(false)
                .build();
    }

    public static Job toEntity(Job job, JobRequest request) {
        return job
                .setTitle(request.getTitle())
                .setDescription(request.getDescription())
                .setStartDate(request.getStartDate())
                .setEndDate(request.getEndDate())
                .setSalaryFrom(request.getSalaryFrom())
                .setSalaryTo(request.getSalaryTo())
                .setWorkingAddress(request.getWorkingAddress())
                .setSkills(request.getSkills().stream().map(s -> Skill.valueOf(s.toUpperCase()).getValue())
                        .collect(Collectors.joining(", ")))
                .setBenefits(request.getBenefits().stream().map(b -> Benefit.valueOf(b.toUpperCase()).getValue())
                        .collect(Collectors.joining(", ")))
                .setLevels(request.getLevels().stream().map(l -> Level.valueOf(l.toUpperCase()).getValue())
                        .collect(Collectors.joining(", ")))
                .setDepartment(Department.valueOf(request.getDepartment().toUpperCase()))
                .setIsDeleted(false);
    }

    public static JobResponse toResponse(Job job) {
        return JobResponse.builder()
                .jobId(job.getJobId())
                .title(job.getTitle())
                .description(job.getDescription())
                .startDate(job.getStartDate())
                .endDate(job.getEndDate())
                .salaryFrom(job.getSalaryFrom())
                .salaryTo(job.getSalaryTo())
                .workingAddress(job.getWorkingAddress())
                .status(JobStatus.fromCode(job.getStatus()))
                .skills(Arrays.stream(job.getSkills().split(", ")).map(Skill::fromValue).collect(Collectors.toList()))
                .benefits(Arrays.stream(job.getBenefits().split(", ")).map(Benefit::fromValue).collect(Collectors.toList()))
                .levels(Arrays.stream(job.getLevels().split(", ")).map(Level::fromValue).collect(Collectors.toList()))
                .department(job.getDepartment())
                .build();
    }
}