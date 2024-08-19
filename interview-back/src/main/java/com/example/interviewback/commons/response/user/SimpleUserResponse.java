package com.example.interviewback.commons.response.user;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SimpleUserResponse {
    private Long userId;
    private String fullName;
    private String username;
}
