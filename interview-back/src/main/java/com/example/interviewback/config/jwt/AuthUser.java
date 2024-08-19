package com.example.interviewback.config.jwt;

import com.example.interviewback.commons.entity.role.Role;
import lombok.Builder;
import lombok.Data;
import lombok.experimental.Accessors;

@Data
@Builder
@Accessors(chain = true)
public class AuthUser {
    private Long userId;
    private Role role;
}
