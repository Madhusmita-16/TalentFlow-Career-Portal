package com.talentflow.careerportal.controller;

import com.talentflow.careerportal.dto.ApiResponse;
import com.talentflow.careerportal.dto.TechnicalAssessmentDto;
import com.talentflow.careerportal.service.AssessmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST controller for candidate technical assessment assignments and grading.
 */
@RestController
@RequestMapping("/api/assessments")
@CrossOrigin(origins = "*", maxAge = 3600)
public class AssessmentController {

    private final AssessmentService assessmentService;

    @Autowired
    public AssessmentController(AssessmentService assessmentService) {
        this.assessmentService = assessmentService;
    }

    /**
     * Endpoint for assigning a technical coding assessment to candidate.
     *
     * @param candidateId Candidate entity ID.
     * @param jobId Target Job ID.
     * @param assessmentName Assessment title.
     * @return ResponseEntity with assigned TechnicalAssessmentDto.
     */
    @PostMapping("/assign")
    public ResponseEntity<ApiResponse<TechnicalAssessmentDto>> assignAssessment(
            @RequestParam Long candidateId,
            @RequestParam Long jobId,
            @RequestParam(required = false, defaultValue = "Full Stack Coding Challenge") String assessmentName) {
        TechnicalAssessmentDto dto = assessmentService.assignAssessment(candidateId, jobId, assessmentName);
        return ResponseEntity.ok(ApiResponse.success(dto, "Technical assessment assigned successfully."));
    }

    /**
     * Endpoint for submitting candidate assessment test score.
     *
     * @param assessmentId Assessment entity ID.
     * @param score Obtained score.
     * @param feedback Evaluator feedback.
     * @return ResponseEntity with updated TechnicalAssessmentDto.
     */
    @PostMapping("/{assessmentId}/submit-score")
    public ResponseEntity<ApiResponse<TechnicalAssessmentDto>> submitScore(
            @PathVariable Long assessmentId,
            @RequestParam Integer score,
            @RequestParam(required = false) String feedback) {
        TechnicalAssessmentDto dto = assessmentService.submitAssessmentScore(assessmentId, score, feedback);
        return ResponseEntity.ok(ApiResponse.success(dto, "Assessment score submitted successfully."));
    }

    /**
     * Endpoint for fetching candidate assigned technical assessments.
     *
     * @param candidateId Candidate entity ID.
     * @return ResponseEntity with list of TechnicalAssessmentDto.
     */
    @GetMapping("/candidate/{candidateId}")
    public ResponseEntity<ApiResponse<List<TechnicalAssessmentDto>>> getCandidateAssessments(@PathVariable Long candidateId) {
        List<TechnicalAssessmentDto> list = assessmentService.getCandidateAssessments(candidateId);
        return ResponseEntity.ok(ApiResponse.success(list, "Candidate assessments fetched successfully."));
    }
}
