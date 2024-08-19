package com.example.interviewback.commons.response.user;

import com.example.interviewback.commons.response.role.SimpleRoleResponse;
import lombok.Builder;
import lombok.Data;
import lombok.experimental.Accessors;

@Data
@Builder
@Accessors(chain = true)
public class LoginUserResponse {
    private String token;
    private Long userId;
    private String username;
    private String fullName;
    private String email;
    private SimpleRoleResponse role;
}
