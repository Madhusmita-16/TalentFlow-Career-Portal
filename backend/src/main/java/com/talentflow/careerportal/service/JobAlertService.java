package com.talentflow.careerportal.service;

import com.talentflow.careerportal.dto.JobResponseDTO;

import java.util.List;

/**
 * Service interface managing candidate automated job alert subscriptions, matching algorithms,
 * and daily/weekly email notifications for new job postings.
 */
public interface JobAlertService {

    /**
     * Subscribes candidate to automated job alerts based on search criteria.
     *
     * @param userId Candidate User ID.
     * @param keywords Search keywords (e.g., "Java", "Remote").
     * @param location Desired location filter.
     * @param frequency Email frequency ("DAILY", "WEEKLY").
     */
    void createJobAlertSubscription(Long userId, String keywords, String location, String frequency);

    /**
     * Triggers job alert matching run and dispatches email digests to subscribers.
     *
     * @return Count of notifications sent.
     */
    int processScheduledJobAlerts();

    /**
     * Finds matching new job postings for a candidate's saved job alert criteria.
     *
     * @param keywords Alert keyword criteria.
     * @param location Alert location filter.
     * @return List of matching JobResponseDTO postings.
     */
    List<JobResponseDTO> findMatchingJobsForAlert(String keywords, String location);
}
