package com.example.interviewback.config.jwt;

import com.example.interviewback.util.JsonUtil;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.HashMap;
import java.util.List;

@Service
public class JwtService {
    @Value("${spring.security.jwt.secret-key}")
    private String secretKey;
    @Value("${spring.security.jwt.expired-in}")
    private Long expiredIn;

    public String generateToken(AuthUser authUser) {
        return Jwts.builder()
                .setClaims(new HashMap<>() {{
                    put("data", JsonUtil.objectToJson(authUser));
                }})
                .setSubject(authUser.getUserId().toString())
                .setExpiration(new Date(System.currentTimeMillis() + expiredIn))
                .signWith(SignatureAlgorithm.HS256, secretKey)
                .compact();
    }

    public Claims extractClaims(String token) {
        try {
            return Jwts.parser()
                    .setSigningKey(secretKey)
                    .parseClaimsJws(token)
                    .getBody();
        } catch (Exception e) {
            System.out.println("ERROR: parsing jwt token failed!");
        }
        return null;
    }

    public Authentication extractAuth(String token) {
        AuthUser authUser = JsonUtil.jsonToObject(
                (String) extractClaims(token)
                        .get("data"),
                AuthUser.class);
        return new UsernamePasswordAuthenticationToken(
                authUser.getUserId(),
                authUser,
                List.of(new SimpleGrantedAuthority("ROLE_" + authUser.getRole().getRoleName().toUpperCase())));
    }

    public Boolean isExpired(String token) {
        Claims claims = extractClaims(token);
        return claims == null || claims
                .getExpiration()
                .before(new Date());
    }
}
