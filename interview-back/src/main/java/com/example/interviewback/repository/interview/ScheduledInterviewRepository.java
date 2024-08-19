package com.example.interviewback.repository.interview;

import com.example.interviewback.commons.entity.interview.ScheduledInterview;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

public interface ScheduledInterviewRepository extends JpaRepository<ScheduledInterview, Long> {
    @Modifying
    @Transactional
    @Query("update ScheduledInterview si set si.isAvailable = true where si.interview.interviewId " +
            "in (select i.interviewId from Interview i where i.candidate.candidateId = :candidateId)")
    void setAvailableByCandidateId(Long candidateId);

    @Modifying
    @Transactional
    @Query("update ScheduledInterview si set si.isAvailable = true where si.interview.interviewId " +
            "in (select i.interviewId from Interview i where i.job.jobId = :jobId)")
    void setAvailableByJobId(Long jobId);

    @Query("select distinct si.interviewer.userId from ScheduledInterview si where (si.isAvailable = false or si.isAvailable is null) and " +
            "si.interviewer.userId in :userIds and" +
            "((si.startTime <= :startTime and si.endTime >= :startTime) " +
            "or (si.startTime <= :endTime and si.endTime >= :endTime) " +
            "or (si.startTime >= :startTime and si.endTime <= :endTime))")
    List<Long> existsOverlappingScheduledInterview(LocalDateTime startTime, LocalDateTime endTime, List<Long> userIds);

    @Query("select distinct si.interviewer.userId from ScheduledInterview si where (si.isAvailable = false or si.isAvailable is null) and " +
            "si.interviewer.userId in :userIds and " +
            "si.interview.interviewId <> :interviewId and " +
            "((si.startTime <= :startTime and si.endTime >= :startTime) " +
            "or (si.startTime <= :endTime and si.endTime >= :endTime) " +
            "or (si.startTime >= :startTime and si.endTime <= :endTime))")
    List<Long> existsOverlappingScheduledInterview(LocalDateTime startTime, LocalDateTime endTime, List<Long> userIds, Long interviewId);

    @Query("select si from ScheduledInterview si where si.interviewer.userId = :userId " +
            "and (si.isAvailable = false or si.isAvailable is null )" +
            "and si.startTime >= :startOfWeek and si.startTime <= :endOfWeek")
    List<ScheduledInterview> findByUserIdAndDate(Long userId, LocalDateTime startOfWeek, LocalDateTime endOfWeek);
}
