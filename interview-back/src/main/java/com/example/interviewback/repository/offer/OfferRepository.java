package com.example.interviewback.repository.offer;

import com.example.interviewback.commons.entity.offer.Offer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

public interface OfferRepository extends JpaRepository<Offer, Long>, JpaSpecificationExecutor<Offer> {
    @Query(value = "SELECT * FROM offer WHERE (created_at BETWEEN :startDate AND :endDate) " +
            "AND (is_deleted = false OR is_deleted IS NULL)", nativeQuery = true)
    List<Offer> findOffersBetweenDates(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);

    @Modifying
    @Transactional
    @Query("update Offer o set o.isDeleted = true where o.interview.interviewId in" +
            "(select i.interviewId from Interview i where i.job.jobId = :jobId)")
    void deleteByJob(Long jobId);

    @Modifying
    @Transactional
    @Query("update Offer o set o.isDeleted = true where o.interview.interviewId in" +
            "(select i.interviewId from Interview i where i.candidate.candidateId = :candidateId)")
    void deleteByCandidate(Long candidateId);

    @Query("select o from Offer o where o.interview.interviewId = :interviewId and (o.isDeleted is null or o.isDeleted = false)")
    List<Offer> findByInterviewId(Long interviewId);
}
