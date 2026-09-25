package com.talentflow.careerportal.service;

import com.talentflow.careerportal.dto.AnalyticsSummaryDto;

/**
 * Service interface for enterprise portal analytics, conversion rates, and skill demand aggregation.
 */
public interface AnalyticsService {

    /**
     * Aggregates platform-wide analytics summary metrics.
     *
     * @return AnalyticsSummaryDto payload.
     */
    AnalyticsSummaryDto getSystemAnalyticsSummary();

    /**
     * Aggregates organization-specific recruitment funnel metrics.
     *
     * @param organizationId Employer Organization ID.
     * @return AnalyticsSummaryDto payload.
     */
    AnalyticsSummaryDto getOrganizationAnalyticsSummary(Long organizationId);
}
