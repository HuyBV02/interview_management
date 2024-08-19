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
public class CandidateJobKey implements Serializable {
    @Column(name = "candidate_id")
    private Long candidateId;
    @Column(name = "job_id")
    private Long jobId;
}
