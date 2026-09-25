package com.talentflow.careerportal.service;

import com.talentflow.careerportal.dto.JobCreateDTO;
import com.talentflow.careerportal.dto.JobResponseDTO;
import com.talentflow.careerportal.dto.JobSearchCriteria;
import com.talentflow.careerportal.dto.PagedResponse;

import java.util.List;

/**
 * Service interface for job listings, multi-criteria search, ATS skill matching,
 * job creation, status updates, and employer posting analytics.
 */
public interface JobService {

    /**
     * Retrieves job details by unique job ID.
     *
     * @param id Job entity ID.
     * @return JobResponseDTO detailed job payload.
     */
    JobResponseDTO getJobById(Long id);

    /**
     * Searches active job postings using structured multi-field filtering criteria.
     *
     * @param criteria Job search filter criteria (query, location, jobType, remoteOnly, salaryMin, skills).
     * @param page Page index.
     * @param size Page size.
     * @return PagedResponse of JobResponseDTO.
     */
    PagedResponse<JobResponseDTO> searchJobs(JobSearchCriteria criteria, int page, int size);

    /**
     * Creates a new job posting for an organization.
     *
     * @param userId Recruiter/Employer User ID creating the posting.
     * @param createDto Job creation payload.
     * @return JobResponseDTO created job details.
     */
    JobResponseDTO createJob(Long userId, JobCreateDTO createDto);

    /**
     * Updates an existing job posting.
     *
     * @param userId Recruiter User ID authorizing the edit.
     * @param jobId Target Job ID.
     * @param updateDto Job updates payload.
     * @return Updated JobResponseDTO payload.
     */
    JobResponseDTO updateJob(Long userId, Long jobId, JobCreateDTO updateDto);

    /**
     * Toggles job posting status (e.g. ACTIVE, CLOSED, DRAFT).
     *
     * @param userId Recruiter User ID.
     * @param jobId Target Job ID.
     * @param status Target status string.
     * @return Updated JobResponseDTO payload.
     */
    JobResponseDTO updateJobStatus(Long userId, Long jobId, String status);

    /**
     * Deletes a job posting.
     *
     * @param userId Recruiter User ID.
     * @param jobId Job entity ID.
     */
    void deleteJob(Long userId, Long jobId);

    /**
     * Increments views count for a job posting.
     *
     * @param jobId Target Job ID.
     */
    void incrementViewsCount(Long jobId);

    /**
     * Retrieves all job postings created by a specific organization.
     *
     * @param organizationId Target Organization ID.
     * @param page Page index.
     * @param size Page size.
     * @return PagedResponse of JobResponseDTO.
     */
    PagedResponse<JobResponseDTO> getJobsByOrganization(Long organizationId, int page, int size);

    /**
     * Matches candidate skills against job requirements and returns recommended jobs.
     *
     * @param candidateId Candidate entity ID.
     * @param limit Max recommendations.
     * @return List of recommended JobResponseDTO postings.
     */
    List<JobResponseDTO> getRecommendedJobsForCandidate(Long candidateId, int limit);
}
