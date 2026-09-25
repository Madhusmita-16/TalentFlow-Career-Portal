package com.talentflow.careerportal.controller;

import com.talentflow.careerportal.dto.JobResponseDTO;
import com.talentflow.careerportal.service.JobAlertService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

/**
 * JUnit 5 test suite for JobAlertController REST endpoints.
 */
@ExtendWith(MockitoExtension.class)
public class JobAlertControllerTest {

    @Mock
    private JobAlertService jobAlertService;

    @InjectMocks
    private JobAlertController jobAlertController;

    @Test
    @DisplayName("Should create job alert subscription and return 200 OK")
    void subscribe_Success() {
        doNothing().when(jobAlertService).createJobAlertSubscription(eq(1L), eq("Java"), eq("Remote"), eq("DAILY"));

        ResponseEntity<?> response = jobAlertController.subscribe(1L, "Java", "Remote", "DAILY");

        assertNotNull(response);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        verify(jobAlertService, times(1)).createJobAlertSubscription(eq(1L), eq("Java"), eq("Remote"), eq("DAILY"));
    }

    @Test
    @DisplayName("Should preview matching jobs for alert criteria")
    void previewMatches_Success() {
        JobResponseDTO jobDto = new JobResponseDTO();
        jobDto.setId(10L);
        jobDto.setTitle("Senior Java Developer");

        when(jobAlertService.findMatchingJobsForAlert(eq("Java"), eq("Remote")))
                .thenReturn(List.of(jobDto));

        ResponseEntity<?> response = jobAlertController.previewMatches("Java", "Remote");

        assertNotNull(response);
        assertEquals(HttpStatus.OK, response.getStatusCode());
    }
}
