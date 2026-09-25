package com.talentflow.careerportal.controller;

import com.talentflow.careerportal.dto.ApplicationDto;
import com.talentflow.careerportal.service.WorkflowEngineService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

/**
 * JUnit 5 test suite for WorkflowController REST endpoints.
 */
@ExtendWith(MockitoExtension.class)
public class WorkflowControllerTest {

    @Mock
    private WorkflowEngineService workflowEngineService;

    @InjectMocks
    private WorkflowController workflowController;

    @Test
    @DisplayName("Should evaluate automated screening rules for application ID")
    void evaluateRules_Success() {
        Map<String, Object> mockMap = Map.of(
                "applicationId", 10L,
                "passedAtsThreshold", true,
                "recommendedStage", "IN_REVIEW"
        );

        when(workflowEngineService.evaluateAutomatedScreeningRules(10L)).thenReturn(mockMap);

        ResponseEntity<?> response = workflowController.evaluateRules(10L);

        assertNotNull(response);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        verify(workflowEngineService, times(1)).evaluateAutomatedScreeningRules(10L);
    }

    @Test
    @DisplayName("Should advance application stage in hiring pipeline")
    void advanceStage_Success() {
        ApplicationDto dto = new ApplicationDto();
        dto.setId(10L);
        dto.setStatus("IN_REVIEW");

        when(workflowEngineService.advancePipelineStage(eq(1L), eq(10L), eq("IN_REVIEW"), eq("Passed screening")))
                .thenReturn(dto);

        ResponseEntity<?> response = workflowController.advanceStage(1L, 10L, "IN_REVIEW", "Passed screening");

        assertNotNull(response);
        assertEquals(HttpStatus.OK, response.getStatusCode());
    }
}
