package com.example.interviewback.commons.entity.interview;

import com.example.interviewback.commons.constant.attributes.Result;
import com.example.interviewback.commons.constant.status.InterviewStatus;
import com.example.interviewback.commons.entity.candidate.Candidate;
import com.example.interviewback.commons.entity.job.Job;
import com.example.interviewback.commons.entity.user.User;
import com.example.interviewback.config.annotion.Search;
import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.Accessors;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Accessors(chain = true)
public class Interview {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long interviewId;
    @Search
    private String title;
    @Search
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private String note;
    private String location;
    private String meetingId;
    private Integer status;
    @Enumerated(EnumType.STRING)
    @Search
    private Result result;

    @ManyToOne
    @JoinColumn(name = "candidate_id")
    private Candidate candidate;
    @ManyToOne
    @JoinColumn(name = "job_id")
    private Job job;
    @ManyToOne
    @JoinColumn(name = "recruit_id")
    private User recruit;
    @OneToMany(mappedBy = "interview")
    private List<ScheduledInterview> scheduledInterviews;
    private String fileNote;

    // loggedId
    private Long createdBy;
    private Long updatedBy;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Boolean isDeleted = false;
}
