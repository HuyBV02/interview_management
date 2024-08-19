package com.example.interviewback.commons.request.candidate;

import com.example.interviewback.commons.request.job.SimpleJobRequest;
import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.Accessors;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Accessors(chain = true)
public class CandidateRequest {
    @NotBlank(message = "Full name is required!")
    private String fullName;

    @JsonFormat(pattern = "dd-MM-yyyy")
    @Past(message = "Date of birth must be in the past!")
    private LocalDate dob;

    @Pattern(regexp = "^[0-9]{9,15}$", message = "Phone number is invalid!")
    private String phoneNumber;

    @NotBlank(message = "Email is required!")
    @Email(message = "Email is invalid!")
    private String email;
    private String address;

    @NotBlank(message = "Gender is required!")
    private String gender;

    private String cv;
    private String note;

    @Positive(message = "Year of Experience from must be positive!")
    private Integer yearOfExp;

    @NotBlank(message = "Position is required!")
    private String position;

    @NotBlank(message = "Highest Level is required!")
    private String highestLevel;

    @NotEmpty(message = "Skills are required!")
    private List<String> skills;

    private List<Long> jobIds = new ArrayList<>();

    @NotEmpty(message = "Job are required!")
    private List<SimpleJobRequest> jobs = new ArrayList<>();

    @NotNull(message = "Recruiter ID is required!")
    private Long recruiterId;
    private Boolean isPublic = false;
}
