package com.example.interviewback.commons.request.user;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.*;
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
public class UserRequest {
    @NotBlank(message = "Full name is required!")
    private String fullName;

    @Past(message = "Date of birth must be in the past!")
    @JsonFormat(pattern = "dd-MM-yyyy")
    private LocalDate dob;

    @Pattern(regexp = "^[0-9]{9,15}$", message = "Phone number is invalid!")
    private String phoneNumber;

    @NotBlank(message = "Email is required!")
    @Email(message = "Email is invalid!")
    private String email;

    private String address;

    @NotBlank(message = "Gender is required!")
    private String gender;

    @NotBlank(message = "Department is required!")
    private String department;
    private String note;

    @NotNull(message = "Role ID is required!")
    private Long roleId;

    @NotEmpty(message = "Skills are required!")
    private List<String> skills;
}
