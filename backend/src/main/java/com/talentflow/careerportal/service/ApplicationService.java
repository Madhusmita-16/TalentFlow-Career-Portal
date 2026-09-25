package com.talentflow.careerportal.service;

import com.talentflow.careerportal.dto.ApplicationDto;
import com.talentflow.careerportal.dto.ApplicationStatusUpdateDTO;
import com.talentflow.careerportal.dto.ApplicationSubmitDTO;
import com.talentflow.careerportal.dto.PagedResponse;
import com.talentflow.careerportal.dto.RecruiterNoteDto;

import java.util.List;

/**
 * Service interface for candidate job applications, applicant pipeline tracking,
 * status transitions, ATS match scoring, recruiter notes, and interview integration.
 */
public interface ApplicationService {

    /**
     * Submits a candidate job application for a target position.
     *
     * @param userId User ID of the candidate applicant.
     * @param submitDto Application payload (jobId, coverLetter, screeningAnswers, resumeUrl).
     * @return ApplicationDto submitted application details.
     */
    ApplicationDto submitApplication(Long userId, ApplicationSubmitDTO submitDto);

    /**
     * Retrieves application details by application ID.
     *
     * @param id Application entity ID.
     * @return ApplicationDto application details.
     */
    ApplicationDto getApplicationById(Long id);

    /**
     * Retrieves all job applications submitted by a candidate.
     *
     * @param userId User ID of the candidate.
     * @param page Page index.
     * @param size Page size limit.
     * @return PagedResponse of ApplicationDto items.
     */
    PagedResponse<ApplicationDto> getApplicationsByCandidateUser(Long userId, int page, int size);

    /**
     * Retrieves all candidate applications for a specific job posting.
     *
     * @param jobId Target Job entity ID.
     * @param page Page index.
     * @param size Page size limit.
     * @return PagedResponse of ApplicationDto items.
     */
    PagedResponse<ApplicationDto> getApplicationsByJob(Long jobId, int page, int size);

    /**
     * Updates applicant stage status in hiring workflow pipeline (e.g. APPLIED, IN_REVIEW, SHORTLISTED, REJECTED, OFFER).
     *
     * @param userId Authorized recruiter User ID.
     * @param applicationId Application entity ID.
     * @param updateDto Target status and status change reason.
     * @return Updated ApplicationDto payload.
     */
    ApplicationDto updateApplicationStatus(Long userId, Long applicationId, ApplicationStatusUpdateDTO updateDto);

    /**
     * Adds an internal recruiter note to a candidate application.
     *
     * @param recruiterUserId User ID of the recruiter writing the note.
     * @param applicationId Target Application entity ID.
     * @param noteText Content of the recruiter note.
     * @return ApplicationDto updated application payload.
     */
    ApplicationDto addRecruiterNote(Long recruiterUserId, Long applicationId, String noteText);

    /**
     * Withdraws an active job application by candidate.
     *
     * @param userId Candidate User ID authorizing withdrawal.
     * @param applicationId Application entity ID.
     * @return ApplicationDto updated application payload.
     */
    ApplicationDto withdrawApplication(Long userId, Long applicationId);

    /**
     * Recalculates ATS alignment score for an application against current job requirements.
     *
     * @param applicationId Application entity ID.
     * @return Integer match score (0-100).
     */
    int recalculateAtsMatchScore(Long applicationId);
}
