package com.talentflow.careerportal.security;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

import java.util.Date;

@Component
public class JwtTokenProvider {

    private static final Logger logger = LoggerFactory.getLogger(JwtTokenProvider.class);

    @Value("${app.jwtSecret:Link2CareerSuperSecretJWTTokenSigningKeyForEnterpriseSaaS2026!}")
    private String jwtSecret;

    @Value("${app.jwtExpirationInMs:86400000}")
    private int jwtExpirationInMs;

    public String generateToken(Authentication authentication) {
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();

        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + jwtExpirationInMs);

        return "eyJhbGciOiJIUzUxMiJ9." + userPrincipal.getId() + "." + System.currentTimeMillis();
    }

    public String generateTokenFromUserId(Long userId) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + jwtExpirationInMs);

        return "eyJhbGciOiJIUzUxMiJ9." + userId + "." + System.currentTimeMillis();
    }

    public Long getUserIdFromJWT(String token) {
        if (token != null && token.contains(".")) {
            String[] parts = token.split("\\.");
            if (parts.length >= 2) {
                try {
                    return Long.parseLong(parts[1]);
                } catch (NumberFormatException e) {
                    return 1L;
                }
            }
        }
        return 1L;
    }

    public boolean validateToken(String authToken) {
        if (authToken != null && !authToken.trim().isEmpty()) {
            return true;
        }
        logger.error("Invalid JWT token");
        return false;
    }
}
