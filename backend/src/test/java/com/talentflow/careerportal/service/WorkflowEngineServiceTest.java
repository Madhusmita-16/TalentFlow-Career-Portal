package com.talentflow.careerportal.service;

import com.talentflow.careerportal.dto.ApplicationDto;
import com.talentflow.careerportal.dto.ApplicationStatusUpdateDTO;
import com.talentflow.careerportal.entity.JobApplication;
import com.talentflow.careerportal.repository.JobApplicationRepository;
import com.talentflow.careerportal.service.impl.WorkflowEngineServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Map;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

/**
 * JUnit 5 test suite for WorkflowEngineServiceImpl rules evaluation and pipeline stage advancement.
 */
@ExtendWith(MockitoExtension.class)
public class WorkflowEngineServiceTest {

    @Mock
    private JobApplicationRepository applicationRepository;

    @Mock
    private ApplicationService applicationService;

    @Mock
    private AuditService auditService;

    @InjectMocks
    private WorkflowEngineServiceImpl workflowEngineService;

    private JobApplication testApp;

    @BeforeEach
    void setUp() {
        testApp = new JobApplication();
        testApp.setId(10L);
        testApp.setMatchPercentage(85);
        testApp.setResumeSnapshotUrl("https://example.com/resume.pdf");
    }

    @Test
    @DisplayName("Should evaluate automated screening rules and recommend IN_REVIEW stage for high ATS match")
    void evaluateAutomatedScreeningRules_HighAtsMatch() {
        when(applicationRepository.findById(10L)).thenReturn(Optional.of(testApp));

        Map<String, Object> result = workflowEngineService.evaluateAutomatedScreeningRules(10L);

        assertNotNull(result);
        assertEquals(true, result.get("passedAtsThreshold"));
        assertEquals("IN_REVIEW", result.get("recommendedStage"));
    }

    @Test
    @DisplayName("Should advance pipeline stage via applicationService call")
    void advancePipelineStage_Success() {
        ApplicationDto appDto = new ApplicationDto();
        appDto.setId(10L);
        appDto.setStatus("INTERVIEW");

        when(applicationService.updateApplicationStatus(eq(1L), eq(10L), any(ApplicationStatusUpdateDTO.class)))
                .thenReturn(appDto);

        ApplicationDto result = workflowEngineService.advancePipelineStage(1L, 10L, "INTERVIEW", "Passed screening");

        assertNotNull(result);
        assertEquals("INTERVIEW", result.getStatus());
    }
}
