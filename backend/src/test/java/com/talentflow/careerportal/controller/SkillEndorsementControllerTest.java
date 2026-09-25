package com.talentflow.careerportal.controller;

import com.talentflow.careerportal.dto.SkillEndorsementDto;
import com.talentflow.careerportal.service.SkillEndorsementService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.time.LocalDateTime;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

/**
 * JUnit 5 test suite for SkillEndorsementController REST endpoints.
 */
@ExtendWith(MockitoExtension.class)
public class SkillEndorsementControllerTest {

    @Mock
    private SkillEndorsementService endorsementService;

    @InjectMocks
    private SkillEndorsementController endorsementController;

    private SkillEndorsementDto endorsementDto;

    @BeforeEach
    void setUp() {
        endorsementDto = new SkillEndorsementDto();
        endorsementDto.setId(101L);
        endorsementDto.setCandidateId(10L);
        endorsementDto.setSkillName("Java");
        endorsementDto.setEndorserName("Sarah Recruiter");
        endorsementDto.setEndorserTitle("Lead Manager");
        endorsementDto.setCreatedAt(LocalDateTime.now());
    }

    @Test
    @DisplayName("Should endorse skill and return 200 OK with SkillEndorsementDto")
    void endorseSkill_Success() {
        when(endorsementService.endorseSkill(eq(10L), eq("Java"), eq("Sarah Recruiter"), eq("Lead Manager")))
                .thenReturn(endorsementDto);

        ResponseEntity<?> response = endorsementController.endorseSkill(10L, "Java", "Sarah Recruiter", "Lead Manager");

        assertNotNull(response);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        verify(endorsementService, times(1)).endorseSkill(eq(10L), eq("Java"), eq("Sarah Recruiter"), eq("Lead Manager"));
    }

    @Test
    @DisplayName("Should return candidate skill endorsements list")
    void getCandidateEndorsements_Success() {
        when(endorsementService.getEndorsementsForCandidate(10L)).thenReturn(List.of(endorsementDto));

        ResponseEntity<?> response = endorsementController.getCandidateEndorsements(10L);

        assertNotNull(response);
        assertEquals(HttpStatus.OK, response.getStatusCode());
    }
}
