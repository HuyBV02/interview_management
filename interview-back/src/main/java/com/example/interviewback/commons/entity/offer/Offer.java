package com.example.interviewback.commons.entity.offer;

import com.example.interviewback.commons.constant.attributes.ContractType;
import com.example.interviewback.commons.constant.attributes.Department;
import com.example.interviewback.commons.constant.attributes.Level;
import com.example.interviewback.commons.constant.attributes.Position;
import com.example.interviewback.commons.constant.status.OfferStatus;
import com.example.interviewback.commons.entity.candidate.Candidate;
import com.example.interviewback.commons.entity.interview.Interview;
import com.example.interviewback.commons.entity.user.User;
import com.example.interviewback.config.annotion.Search;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.Accessors;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Accessors(chain = true)
public class Offer {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long offerId;
    private LocalDate startContract;
    private LocalDate endContract;
    private LocalDate dueDate;
    private Double basicSalary;
    @Search
    private String note;
    @Enumerated(EnumType.STRING)
    private ContractType contractType;
    @Search
    @Enumerated(EnumType.STRING)
    private Department department;
    @Enumerated(EnumType.STRING)
    private Position position;
    @Enumerated(EnumType.STRING)
    private Level level;
    private Integer status;

    @ManyToOne
    @JoinColumn(name = "candidate_id")
    private Candidate candidate;
    @ManyToOne
    @JoinColumn(name = "approver_id")
    private User approver;
    @ManyToOne
    @JoinColumn(name = "recruiter_id")
    private User recruiter;
    @OneToOne
    @JoinColumn(name = "interview_id")
    private Interview interview;

    // loggedId
    private Long createdBy;
    private Long updatedBy;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Boolean isDeleted = false;
}
