package com.example.interviewback.util;

import org.springframework.security.core.context.SecurityContextHolder;

public class AuthUtil {
    public static Long loggedId() {
        return (Long) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    }

    public static String loggedRole() {
        return SecurityContextHolder.getContext().getAuthentication()
                .getAuthorities().iterator().next()
                .getAuthority().substring(5);
    }
}
