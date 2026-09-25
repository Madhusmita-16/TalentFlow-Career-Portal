package com.talentflow.careerportal.controller;

import com.talentflow.careerportal.dto.ApplicationDto;
import com.talentflow.careerportal.dto.ApplicationStatusUpdateDTO;
import com.talentflow.careerportal.dto.ApplicationSubmitDTO;
import com.talentflow.careerportal.dto.PagedResponse;
import com.talentflow.careerportal.service.ApplicationService;
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
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

/**
 * JUnit 5 test suite for ApplicationController REST endpoints.
 */
@ExtendWith(MockitoExtension.class)
public class ApplicationControllerTest {

    @Mock
    private ApplicationService applicationService;

    @InjectMocks
    private ApplicationController applicationController;

    private ApplicationDto testAppDto;

    @BeforeEach
    void setUp() {
        testAppDto = new ApplicationDto();
        testAppDto.setId(100L);
        testAppDto.setJobId(10L);
        testAppDto.setJobTitle("Principal Java Architect");
        testAppDto.setCompanyName("Link2Career Tech");
        testAppDto.setCandidateId(5L);
        testAppDto.setCandidateName("Alex Morgan");
        testAppDto.setStatus("APPLIED");
        testAppDto.setMatchPercentage(92);
        testAppDto.setAppliedAt(LocalDateTime.now());
    }

    @Test
    @DisplayName("Should submit application and return 200 OK with ApplicationDto payload")
    void submitApplication_Success() {
        ApplicationSubmitDTO submitDto = new ApplicationSubmitDTO();
        submitDto.setJobId(10L);
        submitDto.setCoverLetter("Interested in high scale systems.");

        when(applicationService.submitApplication(eq(1L), any(ApplicationSubmitDTO.class)))
                .thenReturn(testAppDto);

        ResponseEntity<?> response = applicationController.submitApplication(1L, submitDto);

        assertNotNull(response);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        verify(applicationService, times(1)).submitApplication(eq(1L), any(ApplicationSubmitDTO.class));
    }

    @Test
    @DisplayName("Should retrieve application details by ID")
    void getApplicationById_Success() {
        when(applicationService.getApplicationById(100L)).thenReturn(testAppDto);

        ResponseEntity<?> response = applicationController.getApplicationById(100L);

        assertNotNull(response);
        assertEquals(HttpStatus.OK, response.getStatusCode());
    }

    @Test
    @DisplayName("Should update application status and return updated DTO")
    void updateApplicationStatus_Success() {
        ApplicationStatusUpdateDTO updateDto = new ApplicationStatusUpdateDTO();
        updateDto.setStatus("SHORTLISTED");
        updateDto.setNotes("Candidate passed initial recruiter screening.");

        testAppDto.setStatus("SHORTLISTED");
        when(applicationService.updateApplicationStatus(eq(1L), eq(100L), any(ApplicationStatusUpdateDTO.class)))
                .thenReturn(testAppDto);

        ResponseEntity<?> response = applicationController.updateStatus(1L, 100L, updateDto);

        assertNotNull(response);
        assertEquals(HttpStatus.OK, response.getStatusCode());
    }
}
