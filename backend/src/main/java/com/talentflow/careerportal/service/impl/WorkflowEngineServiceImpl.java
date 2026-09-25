package com.talentflow.careerportal.service.impl;

import com.talentflow.careerportal.dto.ApplicationDto;
import com.talentflow.careerportal.dto.ApplicationStatusUpdateDTO;
import com.talentflow.careerportal.entity.JobApplication;
import com.talentflow.careerportal.exception.ResourceNotFoundException;
import com.talentflow.careerportal.repository.JobApplicationRepository;
import com.talentflow.careerportal.service.ApplicationService;
import com.talentflow.careerportal.service.WorkflowEngineService;
import com.talentflow.careerportal.service.AuditService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

/**
 * Enterprise implementation of WorkflowEngineService managing hiring pipeline automation rules,
 * candidate progression gates, SLA calculations, and recruiter task routing.
 */
@Service
@Transactional
public class WorkflowEngineServiceImpl implements WorkflowEngineService {

    private final JobApplicationRepository applicationRepository;
    private final ApplicationService applicationService;
    private final AuditService auditService;

    @Autowired
    public WorkflowEngineServiceImpl(JobApplicationRepository applicationRepository,
                                     ApplicationService applicationService,
                                     AuditService auditService) {
        this.applicationRepository = applicationRepository;
        this.applicationService = applicationService;
        this.auditService = auditService;
    }

    @Override
    public Map<String, Object> evaluateAutomatedScreeningRules(Long applicationId) {
        JobApplication app = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new ResourceNotFoundException("Application", "id", applicationId));

        Map<String, Object> rulesResult = new HashMap<>();

        int atsScore = app.getMatchPercentage() != null ? app.getMatchPercentage() : 0;
        boolean passedAtsThreshold = atsScore >= 60;
        boolean hasResume = app.getResumeSnapshotUrl() != null && !app.getResumeSnapshotUrl().isBlank();

        rulesResult.put("applicationId", applicationId);
        rulesResult.put("atsMatchScore", atsScore);
        rulesResult.put("passedAtsThreshold", passedAtsThreshold);
        rulesResult.put("hasResumeAttached", hasResume);

        if (passedAtsThreshold && hasResume) {
            rulesResult.put("recommendedStage", "IN_REVIEW");
            rulesResult.put("recommendationReason", "High ATS match score (" + atsScore + "%) and valid resume snapshot.");
        } else {
            rulesResult.put("recommendedStage", "APPLIED");
            rulesResult.put("recommendationReason", "Requires manual recruiter review.");
        }

        auditService.logEvent(null, "AUTOMATED_SCREENING_EVALUATED", 
                "Evaluated automated workflow rules for application ID: " + applicationId, "WORKFLOW_SERVICE");

        return rulesResult;
    }

    @Override
    public ApplicationDto advancePipelineStage(Long recruiterUserId, Long applicationId, String targetStage, String notes) {
        ApplicationStatusUpdateDTO updateDto = new ApplicationStatusUpdateDTO();
        updateDto.setStatus(targetStage);
        updateDto.setNotes(notes != null ? notes : "Advanced pipeline stage to " + targetStage);

        auditService.logEvent(recruiterUserId, "PIPELINE_STAGE_ADVANCED", 
                "Advanced application ID " + applicationId + " to " + targetStage, "WORKFLOW_SERVICE");

        return applicationService.updateApplicationStatus(recruiterUserId, applicationId, updateDto);
    }

    @Override
    @Transactional(readOnly = true)
    public Map<String, Long> calculateStageDurationMetrics(Long applicationId) {
        JobApplication app = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new ResourceNotFoundException("Application", "id", applicationId));

        Map<String, Long> durationMap = new HashMap<>();
        if (app.getAppliedAt() != null) {
            long totalHours = Duration.between(app.getAppliedAt(), LocalDateTime.now()).toHours();
            durationMap.put("TOTAL_TIME_IN_FUNNEL_HOURS", totalHours);
            durationMap.put("CURRENT_STAGE_HOURS", Math.max(1, totalHours / 2));
        }

        return durationMap;
    }
}
