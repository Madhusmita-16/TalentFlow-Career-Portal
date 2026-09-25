package com.talentflow.careerportal.service;

import com.talentflow.careerportal.dto.ApplicationDto;

import java.util.List;
import java.util.Map;

/**
 * Service interface for multi-stage hiring approval workflows, SLA duration tracking,
 * recruiter assignment routing, and automated candidate progression.
 */
public interface WorkflowEngineService {

    /**
     * Evaluates candidate application against automated screening workflow rules.
     *
     * @param applicationId Application entity ID.
     * @return Map containing pass/fail evaluation flags, score thresholds, and recommended next stage.
     */
    Map<String, Object> evaluateAutomatedScreeningRules(Long applicationId);

    /**
     * Advances application to next stage in custom hiring pipeline.
     *
     * @param recruiterUserId Recruiter User ID.
     * @param applicationId Target Application ID.
     * @param targetStage Target pipeline stage name (e.g., SCREENING, INTERVIEW, OFFER, HIRED).
     * @param notes Stage transition notes.
     * @return ApplicationDto updated application state.
     */
    ApplicationDto advancePipelineStage(Long recruiterUserId, Long applicationId, String targetStage, String notes);

    /**
     * Calculates time-in-stage SLA metrics for application pipeline bottlenecks.
     *
     * @param applicationId Target Application ID.
     * @return Map of stage names to duration hours.
     */
    Map<String, Long> calculateStageDurationMetrics(Long applicationId);
}
