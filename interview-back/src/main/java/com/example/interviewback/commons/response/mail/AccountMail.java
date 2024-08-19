package com.example.interviewback.commons.response.mail;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AccountMail {
    private String fullName;
    private String username;
    private String password;
    private String recruiter;
}
