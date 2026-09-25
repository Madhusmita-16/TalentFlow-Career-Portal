package com.talentflow.careerportal.controller;

import com.talentflow.careerportal.dto.CandidateProfileDTO;
import com.talentflow.careerportal.dto.CandidateUpdateDTO;
import com.talentflow.careerportal.service.CandidateService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

/**
 * JUnit 5 test suite for CandidateController REST endpoints.
 */
@ExtendWith(MockitoExtension.class)
public class CandidateControllerTest {

    @Mock
    private CandidateService candidateService;

    @InjectMocks
    private CandidateController candidateController;

    private CandidateProfileDTO profileDTO;

    @BeforeEach
    void setUp() {
        profileDTO = new CandidateProfileDTO();
        profileDTO.setId(10L);
        profileDTO.setUserId(1L);
        profileDTO.setFullName("Jordan Lee");
        profileDTO.setHeadline("Staff Software Engineer");
        profileDTO.setProfileCompletionPercentage(85);
    }

    @Test
    @DisplayName("Should return candidate profile by user ID")
    void getProfileByUserId_Success() {
        when(candidateService.getCandidateProfileByUserId(1L)).thenReturn(profileDTO);

        ResponseEntity<?> response = candidateController.getProfileByUserId(1L);

        assertNotNull(response);
        assertEquals(HttpStatus.OK, response.getStatusCode());
    }

    @Test
    @DisplayName("Should update candidate profile and return updated profile payload")
    void updateProfile_Success() {
        CandidateUpdateDTO updateDto = new CandidateUpdateDTO();
        updateDto.setHeadline("Principal Architect");

        profileDTO.setHeadline("Principal Architect");
        when(candidateService.updateCandidateProfile(eq(1L), any(CandidateUpdateDTO.class))).thenReturn(profileDTO);

        ResponseEntity<?> response = candidateController.updateProfile(1L, updateDto);

        assertNotNull(response);
        assertEquals(HttpStatus.OK, response.getStatusCode());
    }
}
