package com.talentflow.careerportal.controller;

import com.talentflow.careerportal.dto.ApiResponse;
import com.talentflow.careerportal.dto.ApplicationDto;
import com.talentflow.careerportal.service.WorkflowEngineService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * REST controller exposing hiring pipeline workflow rules, automated screening evaluations,
 * and stage transition endpoints.
 */
@RestController
@RequestMapping("/api/workflow")
@CrossOrigin(origins = "*", maxAge = 3600)
public class WorkflowController {

    private final WorkflowEngineService workflowEngineService;

    @Autowired
    public WorkflowController(WorkflowEngineService workflowEngineService) {
        this.workflowEngineService = workflowEngineService;
    }

    /**
     * Endpoint for evaluating automated candidate screening rules.
     *
     * @param applicationId Application entity ID.
     * @return ResponseEntity with screening evaluation map.
     */
    @GetMapping("/screening-rules/{applicationId}")
    public ResponseEntity<ApiResponse<Map<String, Object>>> evaluateRules(@PathVariable Long applicationId) {
        Map<String, Object> result = workflowEngineService.evaluateAutomatedScreeningRules(applicationId);
        return ResponseEntity.ok(ApiResponse.success(result, "Automated screening rules evaluated successfully."));
    }

    /**
     * Endpoint for advancing candidate application to target pipeline stage.
     *
     * @param recruiterUserId Recruiter User ID.
     * @param applicationId Target Application ID.
     * @param targetStage Target pipeline stage name.
     * @param notes Optional transition notes.
     * @return ResponseEntity with updated ApplicationDto.
     */
    @PostMapping("/advance-stage")
    public ResponseEntity<ApiResponse<ApplicationDto>> advanceStage(
            @RequestParam Long recruiterUserId,
            @RequestParam Long applicationId,
            @RequestParam String targetStage,
            @RequestParam(required = false) String notes) {
        ApplicationDto updated = workflowEngineService.advancePipelineStage(recruiterUserId, applicationId, targetStage, notes);
        return ResponseEntity.ok(ApiResponse.success(updated, "Application pipeline stage advanced successfully."));
    }

    /**
     * Endpoint for calculating pipeline SLA stage duration metrics.
     *
     * @param applicationId Target Application ID.
     * @return ResponseEntity with stage duration metrics map.
     */
    @GetMapping("/sla-metrics/{applicationId}")
    public ResponseEntity<ApiResponse<Map<String, Long>>> getSlaMetrics(@PathVariable Long applicationId) {
        Map<String, Long> metrics = workflowEngineService.calculateStageDurationMetrics(applicationId);
        return ResponseEntity.ok(ApiResponse.success(metrics, "SLA metrics fetched successfully."));
    }
}
