package com.example.interviewback.commons.request.user;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class UserEmailRequest {
    @NotBlank(message = "Email is required!")
    @Email(message = "Email is invalid!")
    private String email;
}
