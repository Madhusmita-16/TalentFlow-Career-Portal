package com.talentflow.careerportal.service;

import com.talentflow.careerportal.dto.AuthRequest;
import com.talentflow.careerportal.dto.AuthResponse;
import com.talentflow.careerportal.dto.RegisterRequest;
import com.talentflow.careerportal.entity.User;

/**
 * Service interface defining authentication, user registration, JWT management,
 * password reset, and identity verification operations for the Link2Career platform.
 */
public interface AuthService {

    /**
     * Authenticates a user with username/email and password credentials.
     *
     * @param request Authentication payload containing credentials.
     * @return AuthResponse JWT payload containing token, expiration, user info, and role.
     */
    AuthResponse login(AuthRequest request);

    /**
     * Registers a new job seeker or recruiter account on the platform.
     *
     * @param request Registration payload containing name, email, password, and role.
     * @return AuthResponse JWT payload for immediate session initialization.
     */
    AuthResponse register(RegisterRequest request);

    /**
     * Refreshes an expired JWT access token using a valid refresh token.
     *
     * @param refreshToken The refresh token string.
     * @return AuthResponse Newly issued JWT access token and refresh token.
     */
    AuthResponse refreshToken(String refreshToken);

    /**
     * Initiates a password reset workflow for the user matching the given email address.
     *
     * @param email Email address associated with the account.
     */
    void initiatePasswordReset(String email);

    /**
     * Completes a password reset operation using a verified reset token.
     *
     * @param token Reset token delivered via email/SMS.
     * @param newPassword New account password.
     */
    void resetPassword(String token, String newPassword);

    /**
     * Validates if a given JWT token is active and has not been revoked.
     *
     * @param token JWT access token string.
     * @return true if valid and active, false otherwise.
     */
    boolean validateToken(String token);

    /**
     * Retrieves the currently authenticated domain user entity from SecurityContext.
     *
     * @return Currently authenticated User entity.
     */
    User getCurrentUser();

    /**
     * Logs out the user session by invalidating the refresh token.
     *
     * @param refreshToken The refresh token to revoke.
     */
    void logout(String refreshToken);

    /**
     * Changes the password of an existing authenticated user.
     *
     * @param userId Unique identifier of the user.
     * @param oldPassword Current password for verification.
     * @param newPassword Target new password.
     */
    void changePassword(Long userId, String oldPassword, String newPassword);
}
