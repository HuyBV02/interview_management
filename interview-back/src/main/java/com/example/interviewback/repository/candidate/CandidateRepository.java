package com.example.interviewback.repository.candidate;

import com.example.interviewback.commons.entity.candidate.Candidate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface CandidateRepository extends JpaRepository<Candidate, Long>, JpaSpecificationExecutor<Candidate> {
    List<Candidate> findByStatusNot(Integer status);
    Candidate findByEmail(String email);

    @Query("select c from Candidate c where c.status = :status " +
            "and lower(c.fullName) like lower(concat('%', :searchValue, '%')) " +
            "and (c.isDeleted is null or c.isDeleted = false)")
    List<Candidate> findByStatusAndFullName(Integer status, String searchValue);
}
