package com.example.interviewback.commons.response.job;

import com.example.interviewback.commons.constant.attributes.Benefit;
import com.example.interviewback.commons.constant.attributes.Department;
import com.example.interviewback.commons.constant.attributes.Level;
import com.example.interviewback.commons.constant.attributes.Skill;
import com.example.interviewback.commons.constant.status.JobStatus;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.Accessors;

import java.time.LocalDate;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Accessors(chain = true)
public class JobResponse {
    private Long jobId;
    private String title;
    @JsonFormat(pattern = "dd-MM-yyyy")
    private LocalDate startDate;
    @JsonFormat(pattern = "dd-MM-yyyy")
    private LocalDate endDate;
    private Double salaryFrom;
    private Double salaryTo;
    private String workingAddress;
    private String description;

    private List<Skill> skills;
    private List<Benefit> benefits;
    private List<Level> levels;
    private JobStatus status;
    private String cv;
    private Department department;
}
