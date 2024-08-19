package com.example.interviewback.commons.entity.candidate;

import com.example.interviewback.commons.constant.attributes.Gender;
import com.example.interviewback.commons.constant.attributes.HighestLevel;
import com.example.interviewback.commons.constant.attributes.Position;
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
import java.util.List;

@Entity
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Accessors(chain = true)
public class Candidate {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long candidateId;
    @Search
    private String fullName;
    private LocalDate dob;
    @Search
    private String phoneNumber;
    @Search
    @Column(unique = true, nullable = false)
    private String email;
    private String address;

    @Enumerated(EnumType.STRING)
    private Gender gender;
    private String cv;
    private String note;

    private Integer status;
    private Integer yearOfExp;

    @Enumerated(EnumType.STRING)
    @Search
    private Position position;

    @Enumerated(EnumType.STRING)
    private HighestLevel highestLevel;
    private String skills;

    @ManyToOne
    @JoinColumn(name = "recruiter_id")
    private User recruiter;

    @OneToMany
    @JoinColumn(name = "candidate_id")
    private List<CandidateJob> candidateJobs;

    // loggedId
    private Long createdBy;
    private Long updatedBy;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Boolean isDeleted = false;
}
