package com.talentflow.careerportal.service;

import com.talentflow.careerportal.dto.AuthRequest;
import com.talentflow.careerportal.dto.AuthResponse;
import com.talentflow.careerportal.dto.RegisterRequest;
import com.talentflow.careerportal.entity.Candidate;
import com.talentflow.careerportal.entity.User;
import com.talentflow.careerportal.exception.BadRequestException;
import com.talentflow.careerportal.exception.DuplicateResourceException;
import com.talentflow.careerportal.exception.UnauthorizedException;
import com.talentflow.careerportal.repository.CandidateRepository;
import com.talentflow.careerportal.repository.UserRepository;
import com.talentflow.careerportal.security.JwtTokenProvider;
import com.talentflow.careerportal.security.UserPrincipal;
import com.talentflow.careerportal.service.impl.AuthServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

/**
 * Enterprise JUnit 5 test suite for AuthServiceImpl verifying user login,
 * registration workflows, token refresh, and exception handling.
 */
@ExtendWith(MockitoExtension.class)
public class AuthServiceTest {

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private UserRepository userRepository;

    @Mock
    private CandidateRepository candidateRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtTokenProvider tokenProvider;

    @Mock
    private AuditService auditService;

    @Mock
    private Authentication authentication;

    @InjectMocks
    private AuthServiceImpl authService;

    private User testUser;
    private UserPrincipal testUserPrincipal;

    @BeforeEach
    void setUp() {
        testUser = new User();
        testUser.setId(1L);
        testUser.setEmail("alex.morgan@example.com");
        testUser.setPassword("encodedPassword123");
        testUser.setFullName("Alex Morgan");
        testUser.setRole(User.Role.JOB_SEEKER);
        testUser.setActive(true);

        testUserPrincipal = UserPrincipal.create(testUser);
    }

    @Test
    @DisplayName("Should successfully authenticate valid credentials and return JWT token response")
    void login_Success() {
        AuthRequest request = new AuthRequest("alex.morgan@example.com", "Password123!");

        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenReturn(authentication);
        when(authentication.getPrincipal()).thenReturn(testUserPrincipal);
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(tokenProvider.generateToken(authentication)).thenReturn("mocked.jwt.token");
        when(tokenProvider.generateRefreshToken(testUser.getEmail())).thenReturn("mocked.refresh.token");
        when(tokenProvider.getJwtExpirationInMs()).thenReturn(86400000L);

        AuthResponse response = authService.login(request);

        assertNotNull(response);
        assertEquals("mocked.jwt.token", response.getAccessToken());
        assertEquals("mocked.refresh.token", response.getRefreshToken());
        assertEquals("Bearer", response.getTokenType());
        assertEquals("alex.morgan@example.com", response.getEmail());
        assertEquals("JOB_SEEKER", response.getRole());

        verify(auditService, times(1)).logEvent(eq(1L), eq("USER_LOGIN_SUCCESS"), anyString(), anyString());
    }

    @Test
    @DisplayName("Should throw BadRequestException when null or empty credentials provided")
    void login_NullCredentials_ThrowsBadRequestException() {
        AuthRequest request = new AuthRequest(null, null);

        assertThrows(BadRequestException.class, () -> authService.login(request));
    }

    @Test
    @DisplayName("Should throw UnauthorizedException on invalid credentials authentication failure")
    void login_InvalidCredentials_ThrowsUnauthorizedException() {
        AuthRequest request = new AuthRequest("alex.morgan@example.com", "WrongPassword");

        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenThrow(new RuntimeException("Bad credentials"));

        assertThrows(UnauthorizedException.class, () -> authService.login(request));
    }

    @Test
    @DisplayName("Should successfully register new user account and provision candidate profile")
    void register_Success() {
        RegisterRequest request = new RegisterRequest();
        request.setFullName("Taylor Swift");
        request.setEmail("taylor.swift@example.com");
        request.setPassword("Password123!");
        request.setRole("JOB_SEEKER");

        when(userRepository.existsByEmail("taylor.swift@example.com")).thenReturn(false);
        when(passwordEncoder.encode("Password123!")).thenReturn("encodedPassword");
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> {
            User u = invocation.getArgument(0);
            u.setId(2L);
            return u;
        });
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenReturn(authentication);
        when(tokenProvider.generateToken(authentication)).thenReturn("new.jwt.token");
        when(tokenProvider.generateRefreshToken("taylor.swift@example.com")).thenReturn("new.refresh.token");

        AuthResponse response = authService.register(request);

        assertNotNull(response);
        assertEquals("new.jwt.token", response.getAccessToken());
        assertEquals("taylor.swift@example.com", response.getEmail());

        verify(candidateRepository, times(1)).save(any(Candidate.class));
        verify(auditService, times(1)).logEvent(eq(2L), eq("USER_REGISTER_SUCCESS"), anyString(), anyString());
    }

    @Test
    @DisplayName("Should throw DuplicateResourceException when registering existing email address")
    void register_DuplicateEmail_ThrowsDuplicateResourceException() {
        RegisterRequest request = new RegisterRequest();
        request.setEmail("alex.morgan@example.com");
        request.setPassword("Password123!");
        request.setFullName("Alex Morgan");

        when(userRepository.existsByEmail("alex.morgan@example.com")).thenReturn(true);

        assertThrows(DuplicateResourceException.class, () -> authService.register(request));
    }
}
