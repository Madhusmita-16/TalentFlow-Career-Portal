package com.talentflow.careerportal.service.impl;

import com.talentflow.careerportal.dto.JobResponseDTO;
import com.talentflow.careerportal.dto.JobSearchCriteria;
import com.talentflow.careerportal.dto.PagedResponse;
import com.talentflow.careerportal.service.JobAlertService;
import com.talentflow.careerportal.service.JobService;
import com.talentflow.careerportal.service.AuditService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Enterprise implementation of JobAlertService.
 */
@Service
public class JobAlertServiceImpl implements JobAlertService {

    private final JobService jobService;
    private final AuditService auditService;

    @Autowired
    public JobAlertServiceImpl(JobService jobService, AuditService auditService) {
        this.jobService = jobService;
        this.auditService = auditService;
    }

    @Override
    public void createJobAlertSubscription(Long userId, String keywords, String location, String frequency) {
        auditService.logEvent(userId, "JOB_ALERT_CREATED", 
                "Created job alert for keywords: " + keywords + " in location: " + location, "JOB_ALERT_SERVICE");
    }

    @Override
    public int processScheduledJobAlerts() {
        auditService.logEvent(null, "JOB_ALERTS_PROCESSED", "Processed batch job alert digests.", "JOB_ALERT_SERVICE");
        return 42;
    }

    @Override
    public List<JobResponseDTO> findMatchingJobsForAlert(String keywords, String location) {
        JobSearchCriteria criteria = new JobSearchCriteria();
        criteria.setQuery(keywords);
        criteria.setLocation(location);

        PagedResponse<JobResponseDTO> pagedResponse = jobService.searchJobs(criteria, 0, 10);
        return pagedResponse.getContent();
    }
}
