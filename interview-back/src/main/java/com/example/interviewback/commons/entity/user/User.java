package com.example.interviewback.commons.entity.user;

import com.example.interviewback.commons.constant.attributes.Department;
import com.example.interviewback.commons.constant.attributes.Gender;
import com.example.interviewback.commons.constant.status.UserStatus;
import com.example.interviewback.commons.entity.role.Role;
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
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long userId;
    @Search
    @Column(unique = true, nullable = false)
    private String username;
    @Column(nullable = false)
    private String password;
    private String fullName;
    private LocalDate dob;
    @Search
    private String phoneNumber;
    private Integer status;
    @Search
    @Column(unique = true, nullable = false)
    private String email;
    private String address;
    @Enumerated(EnumType.STRING)
    private Gender gender;
    @Enumerated(EnumType.STRING)
    private Department department;
    private String note;
    private String skills;

    @ManyToOne
    @JoinColumn(name = "role_id")
    private Role role;

    // loggedId
    private Long createdBy;
    private Long updatedBy;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
