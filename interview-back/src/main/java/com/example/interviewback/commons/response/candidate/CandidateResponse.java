package com.example.interviewback.commons.response.candidate;

import com.example.interviewback.commons.constant.attributes.Gender;
import com.example.interviewback.commons.constant.attributes.HighestLevel;
import com.example.interviewback.commons.constant.attributes.Position;
import com.example.interviewback.commons.constant.attributes.Skill;
import com.example.interviewback.commons.constant.status.CandidateStatus;
import com.example.interviewback.commons.response.job.JobResponse;
import com.example.interviewback.commons.response.user.SimpleUserResponse;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CandidateResponse {
    private Long candidateId;
    private String fullName;
    @JsonFormat(pattern = "dd-MM-yyyy")
    private LocalDate dob;
    private String phoneNumber;
    private String email;
    private String address;

    private Gender gender;
    private String cv;
    private String note;

    private CandidateStatus status;
    private Integer yearOfExp;

    private Position position;

    private HighestLevel highestLevel;
    private List<Skill> skills;

    private SimpleUserResponse recruiter;
    private List<JobResponse> jobs;
}
