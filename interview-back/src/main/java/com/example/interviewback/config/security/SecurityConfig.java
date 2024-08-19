package com.example.interviewback.config.security;

import com.example.interviewback.config.jwt.JwtFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.www.BasicAuthenticationFilter;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {
    private final JwtFilter jwtFilter;
    private final AuthEntryPoint authEntryPoint;

    @Bean
    public SecurityFilterChain configure(HttpSecurity http) throws Exception {
        return http
                .cors(Customizer.withDefaults())
                .csrf(AbstractHttpConfigurer::disable)
                .sessionManagement(session ->
                        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .exceptionHandling(exc ->
                        exc.authenticationEntryPoint(authEntryPoint)
                                .accessDeniedHandler(authEntryPoint))
                .authorizeHttpRequests(auth -> {
                    auth
                            .requestMatchers("/api/user/login", "/api/forgot-password/**", "/img/**", "/api/public/**", "/api/attributes/**").permitAll()
                            .requestMatchers(HttpMethod.GET, "/api/user/list/**").hasAnyRole("ADMIN", "MANAGER", "RECRUITER", "INTERVIEWER")
                            .requestMatchers(HttpMethod.GET, "/api/interview/**", "/api/job/**").hasAnyRole("ADMIN", "MANAGER", "RECRUITER", "INTERVIEWER")
                            .requestMatchers("/api/interview/list/**", "/api/job/list/**", "/api/candidate/upload",
                                    "api/interview/{id}/submit", "api/user/interviewers", "api/user/{id}/schedule")
                            .hasAnyRole("ADMIN", "MANAGER", "RECRUITER", "INTERVIEWER")
                            .requestMatchers("/api/user/**").hasRole("ADMIN")
                            .requestMatchers(HttpMethod.POST, "/api/**").hasAnyRole("ADMIN", "MANAGER", "RECRUITER")
                            .requestMatchers(HttpMethod.PUT, "/api/**").hasAnyRole("ADMIN", "MANAGER", "RECRUITER")
                            .requestMatchers(HttpMethod.DELETE, "/api/**").hasAnyRole("ADMIN", "MANAGER", "RECRUITER")
                            .requestMatchers(HttpMethod.GET, "/api/**").hasAnyRole("ADMIN", "MANAGER", "RECRUITER")
                            .anyRequest().authenticated();
//                    .anyRequest().permitAll();
                })
                .addFilterAfter(jwtFilter, BasicAuthenticationFilter.class)
                .logout(out -> out
                        .logoutUrl("/api/user/logout")
                        .logoutSuccessHandler((request, response, authentication) ->
                                SecurityContextHolder.clearContext()
                        )
                )
                .build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
