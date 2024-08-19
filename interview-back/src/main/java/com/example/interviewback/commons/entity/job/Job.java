package com.example.interviewback.commons.entity.job;

import com.example.interviewback.commons.constant.attributes.Department;
import com.example.interviewback.commons.constant.status.JobStatus;
import com.example.interviewback.config.annotion.Search;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.Accessors;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Accessors(chain = true)
public class Job {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long jobId;
    @Search
    private String title;
    @Search
    private LocalDate startDate;
    @Search
    private LocalDate endDate;
    private Double salaryFrom;
    private Double salaryTo;
    private String workingAddress;
    private String description;

    @Search
    private String skills;
    private String benefits;
    @Search
    private String levels;
    private Integer status;
    @Enumerated(EnumType.STRING)
    private Department department;

    // loggedId
    private Long createdBy;
    private Long updatedBy;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Boolean isDeleted = false;
}
