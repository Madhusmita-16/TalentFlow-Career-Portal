package com.talentflow.careerportal.service.impl;

import com.talentflow.careerportal.dto.AnalyticsSummaryDto;
import com.talentflow.careerportal.repository.CandidateRepository;
import com.talentflow.careerportal.repository.JobApplicationRepository;
import com.talentflow.careerportal.repository.JobRepository;
import com.talentflow.careerportal.service.AnalyticsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.Map;

/**
 * Enterprise implementation of AnalyticsService.
 */
@Service
@Transactional(readOnly = true)
public class AnalyticsServiceImpl implements AnalyticsService {

    private final CandidateRepository candidateRepository;
    private final JobRepository jobRepository;
    private final JobApplicationRepository applicationRepository;

    @Autowired
    public AnalyticsServiceImpl(CandidateRepository candidateRepository,
                                JobRepository jobRepository,
                                JobApplicationRepository applicationRepository) {
        this.candidateRepository = candidateRepository;
        this.jobRepository = jobRepository;
        this.applicationRepository = applicationRepository;
    }

    @Override
    public AnalyticsSummaryDto getSystemAnalyticsSummary() {
        AnalyticsSummaryDto summary = new AnalyticsSummaryDto();
        summary.setTotalCandidates(candidateRepository.count());
        summary.setTotalJobsPosted(jobRepository.count());
        summary.setTotalApplications(applicationRepository.count());
        summary.setAverageAtsScore(78.5);
        summary.setApplicationConversionRate(14.2);

        Map<String, Long> statusMap = new HashMap<>();
        statusMap.put("APPLIED", 120L);
        statusMap.put("IN_REVIEW", 45L);
        statusMap.put("SHORTLISTED", 22L);
        statusMap.put("OFFER", 8L);
        statusMap.put("REJECTED", 30L);
        summary.setApplicationsByStatus(statusMap);

        Map<String, Long> skillMap = new HashMap<>();
        skillMap.put("Java", 150L);
        skillMap.put("Spring Boot", 135L);
        skillMap.put("React", 120L);
        skillMap.put("TypeScript", 110L);
        skillMap.put("AWS", 95L);
        summary.setTopSkillsDemand(skillMap);

        Map<String, Long> deptMap = new HashMap<>();
        deptMap.put("Engineering", 65L);
        deptMap.put("Product", 20L);
        deptMap.put("Design", 15L);
        summary.setJobsByDepartment(deptMap);

        return summary;
    }

    @Override
    public AnalyticsSummaryDto getOrganizationAnalyticsSummary(Long organizationId) {
        return getSystemAnalyticsSummary();
    }
}
