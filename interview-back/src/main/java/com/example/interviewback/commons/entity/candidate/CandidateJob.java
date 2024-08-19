package com.example.interviewback.commons.entity.candidate;

import com.example.interviewback.commons.entity.job.Job;
import com.example.interviewback.commons.entity.key.CandidateJobKey;
import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.Accessors;

@Entity
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Accessors(chain = true)
public class CandidateJob {
    @EmbeddedId
    private CandidateJobKey id;

    @ManyToOne
    @JoinColumn(name = "job_id", insertable = false, updatable = false)
    private Job job;

    private String cv;
}
