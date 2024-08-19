package com.example.interviewback.repository.candidate;

import com.example.interviewback.commons.entity.candidate.CandidateJob;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface CandidateJobRepository extends JpaRepository<CandidateJob, Long> {
    @Query("select cj from CandidateJob cj where cj.id.jobId = :jobId and cj.id.candidateId = :candidateId")
    CandidateJob findByJobIdAndCandidateId(Long jobId, Long candidateId);
}
