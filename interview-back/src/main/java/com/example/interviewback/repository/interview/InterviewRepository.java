package com.example.interviewback.repository.interview;

import com.example.interviewback.commons.constant.attributes.Result;
import com.example.interviewback.commons.entity.interview.Interview;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

public interface InterviewRepository extends JpaRepository<Interview, Long>, JpaSpecificationExecutor<Interview> {
    List<Interview> findByCandidateCandidateIdAndStatus(Long candidateId, Integer status);

    @Query("select i from Interview i left join Offer o on i.interviewId = o.interview.interviewId " +
            "where o.offerId is null " +
            "and i.candidate.candidateId = :candidateId " +
            "and i.status = :status " +
            "and i.result = :result " +
            "and (i.isDeleted is null or i.isDeleted = false) ")
    List<Interview> findByCandidate(Long candidateId, Integer status, Result result);

    @Modifying
    @Transactional
    @Query("update Interview i set i.isDeleted = true where i.job.jobId = :jobId")
    void deleteByJob(Long jobId);

    @Modifying
    @Transactional
    @Query("update Interview i set i.isDeleted = true where i.candidate.candidateId = :candidateId")
    void deleteByCandidate(Long candidateId);

    @Query("select i from Interview i where function('DATE', i.startTime) = :today")
    List<Interview> findInterviewsForToday(LocalDate today);

    @Query("select i from Interview i join fetch i.scheduledInterviews where i.interviewId = :id")
    Interview findByIdWithScheduledInterviews(Long id);
}
