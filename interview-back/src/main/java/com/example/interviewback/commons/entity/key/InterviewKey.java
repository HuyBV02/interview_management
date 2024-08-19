package com.example.interviewback.commons.entity.key;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Embeddable
public class InterviewKey implements Serializable {
    @Column(name = "interview_id")
    private Long interviewId;
    @Column(name = "interviewer_id")
    private Long interviewerId;
}
