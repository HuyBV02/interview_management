package com.example.interviewback.repository.token;

import com.example.interviewback.commons.entity.user.ResetPassToken;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ResetPassTokenRepository extends JpaRepository<ResetPassToken, Long> {
    ResetPassToken findByToken(String token);
}
