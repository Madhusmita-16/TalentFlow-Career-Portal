package com.talentflow.careerportal.controller;

import com.talentflow.careerportal.dto.ApiResponse;
import com.talentflow.careerportal.dto.JobResponseDTO;
import com.talentflow.careerportal.service.JobAlertService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST controller for candidate job alert subscriptions and notification matching.
 */
@RestController
@RequestMapping("/api/job-alerts")
@CrossOrigin(origins = "*", maxAge = 3600)
public class JobAlertController {

    private final JobAlertService jobAlertService;

    @Autowired
    public JobAlertController(JobAlertService jobAlertService) {
        this.jobAlertService = jobAlertService;
    }

    /**
     * Endpoint for creating candidate job alert subscription.
     *
     * @param userId Candidate User ID.
     * @param keywords Keyword criteria.
     * @param location Location filter.
     * @param frequency Delivery frequency (DAILY, WEEKLY).
     * @return ResponseEntity with success message.
     */
    @PostMapping("/subscribe")
    public ResponseEntity<ApiResponse<Void>> subscribe(
            @RequestParam Long userId,
            @RequestParam String keywords,
            @RequestParam(required = false, defaultValue = "Remote") String location,
            @RequestParam(required = false, defaultValue = "DAILY") String frequency) {
        jobAlertService.createJobAlertSubscription(userId, keywords, location, frequency);
        return ResponseEntity.ok(ApiResponse.success(null, "Job alert subscription created successfully."));
    }

    /**
     * Endpoint for previewing matching job postings for alert criteria.
     *
     * @param keywords Search keywords.
     * @param location Location filter.
     * @return ResponseEntity with list of matching JobResponseDTO postings.
     */
    @GetMapping("/preview")
    public ResponseEntity<ApiResponse<List<JobResponseDTO>>> previewMatches(
            @RequestParam String keywords,
            @RequestParam(required = false, defaultValue = "Remote") String location) {
        List<JobResponseDTO> matches = jobAlertService.findMatchingJobsForAlert(keywords, location);
        return ResponseEntity.ok(ApiResponse.success(matches, "Matching job postings fetched successfully."));
    }
}
