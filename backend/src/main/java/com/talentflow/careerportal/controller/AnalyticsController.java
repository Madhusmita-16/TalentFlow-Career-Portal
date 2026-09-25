package com.talentflow.careerportal.controller;

import com.talentflow.careerportal.dto.AnalyticsSummaryDto;
import com.talentflow.careerportal.dto.ApiResponse;
import com.talentflow.careerportal.service.AnalyticsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * REST controller exposing platform and employer organization analytics metrics.
 */
@RestController
@RequestMapping("/api/analytics")
@CrossOrigin(origins = "*", maxAge = 3600)
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    @Autowired
    public AnalyticsController(AnalyticsService analyticsService) {
        this.analyticsService = analyticsService;
    }

    /**
     * Endpoint for retrieving platform-wide analytics summary.
     *
     * @return ResponseEntity with AnalyticsSummaryDto.
     */
    @GetMapping("/summary")
    public ResponseEntity<ApiResponse<AnalyticsSummaryDto>> getSystemSummary() {
        AnalyticsSummaryDto summary = analyticsService.getSystemAnalyticsSummary();
        return ResponseEntity.ok(ApiResponse.success(summary, "System analytics summary fetched successfully."));
    }

    /**
     * Endpoint for retrieving organization-specific recruitment funnel metrics.
     *
     * @param organizationId Employer organization ID.
     * @return ResponseEntity with AnalyticsSummaryDto.
     */
    @GetMapping("/organization/{organizationId}")
    public ResponseEntity<ApiResponse<AnalyticsSummaryDto>> getOrganizationSummary(@PathVariable Long organizationId) {
        AnalyticsSummaryDto summary = analyticsService.getOrganizationAnalyticsSummary(organizationId);
        return ResponseEntity.ok(ApiResponse.success(summary, "Organization analytics summary fetched successfully."));
    }
}
