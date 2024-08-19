package com.example.interviewback.commons.response.user;

import com.example.interviewback.commons.constant.attributes.Department;
import com.example.interviewback.commons.constant.attributes.Gender;
import com.example.interviewback.commons.constant.attributes.Skill;
import com.example.interviewback.commons.constant.status.UserStatus;
import com.example.interviewback.commons.response.role.SimpleRoleResponse;
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
public class UserResponse {
    private Long userId;
    private String username;
    private String fullName;
    @JsonFormat(pattern = "dd-MM-yyyy")
    private LocalDate dob;
    private String phoneNumber;
    private UserStatus status;
    private String email;
    private String address;
    private Gender gender;
    private Department department;
    private String note;
    private SimpleRoleResponse role;
    private List<Skill> skills;
}
