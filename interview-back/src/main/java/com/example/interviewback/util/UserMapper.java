package com.example.interviewback.util;

import com.example.interviewback.commons.constant.attributes.Department;
import com.example.interviewback.commons.constant.attributes.Gender;
import com.example.interviewback.commons.constant.attributes.Skill;
import com.example.interviewback.commons.constant.status.UserStatus;
import com.example.interviewback.commons.entity.role.Role;
import com.example.interviewback.commons.entity.user.User;
import com.example.interviewback.commons.request.user.UserRequest;
import com.example.interviewback.commons.response.role.SimpleRoleResponse;
import com.example.interviewback.commons.response.user.UserResponse;

import java.util.Arrays;
import java.util.stream.Collectors;

public class UserMapper {
    public static User toEntity(UserRequest request) {
        return User.builder()
                .fullName(request.getFullName())
                .email(request.getEmail())
                .dob(request.getDob())
                .address(request.getAddress())
                .phoneNumber(request.getPhoneNumber())
                .note(request.getNote())
                .gender(Gender.valueOf(request.getGender().toUpperCase()))
                .department(Department.valueOf(request.getDepartment().toUpperCase()))
                .skills(request.getSkills().stream().map(s -> Skill.valueOf(s.toUpperCase()).getValue())
                        .collect(Collectors.joining(", ")))
                .role(Role.builder().roleId(request.getRoleId()).build())
                .build();
    }

    public static User toEntity(User user, UserRequest request) {
        return user
                .setFullName(request.getFullName())
                .setEmail(request.getEmail())
                .setDob(request.getDob())
                .setAddress(request.getAddress())
                .setPhoneNumber(request.getPhoneNumber())
                .setNote(request.getNote())
                .setGender(Gender.valueOf(request.getGender().toUpperCase()))
                .setDepartment(Department.valueOf(request.getDepartment().toUpperCase()))
                .setSkills(request.getSkills().stream().map(s -> Skill.valueOf(s.toUpperCase()).getValue())
                        .collect(Collectors.joining(", ")))
                .setRole(Role.builder().roleId(request.getRoleId()).build());
    }

    public static UserResponse toResponse(User user) {
        return UserResponse.builder()
                .userId(user.getUserId())
                .username(user.getUsername())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .dob(user.getDob())
                .address(user.getAddress())
                .phoneNumber(user.getPhoneNumber())
                .note(user.getNote())
                .status(UserStatus.fromCode(user.getStatus()))
                .gender(user.getGender())
                .department(user.getDepartment())
                .skills(Arrays.stream(user.getSkills().split(", ")).map(Skill::fromValue).collect(Collectors.toList()))
                .role(SimpleRoleResponse.builder()
                        .roleId(user.getRole().getRoleId())
                        .roleName(user.getRole().getRoleName())
                        .build())
                .build();
    }
}
