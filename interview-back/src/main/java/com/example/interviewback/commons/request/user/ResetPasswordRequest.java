package com.example.interviewback.commons.request.user;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ResetPasswordRequest {
    @NotBlank(message = "Password is required!")
    private String password;
    @NotBlank(message = "Confirm password is required!")
    private String confirmPassword;
}
