package com.example.interviewback.repository.job;

import com.example.interviewback.commons.entity.job.Job;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

public interface JobRepository extends JpaRepository<Job, Long>, JpaSpecificationExecutor<Job> {
    @Modifying
    @Transactional
    @Query("update Job j set j.status = :status where j.startDate = :today")
    void updateJobStatusByStartDate(LocalDate today, Integer status);

    @Modifying
    @Transactional
    @Query("update Job j set j.status = :status where j.endDate = :today")
    void updateJobStatusByEndDate(LocalDate today, Integer status);

    @Query("select j from Job j where j.status = :status and (j.isDeleted is null or j.isDeleted = false)")
    List<Job> findByStatus(Integer status);
}
