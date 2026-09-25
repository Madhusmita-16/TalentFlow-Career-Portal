package com.talentflow.careerportal.service;

import com.talentflow.careerportal.dto.InterviewDto;
import com.talentflow.careerportal.dto.PagedResponse;

import java.util.List;

/**
 * Service interface for scheduling technical interviews, managing interviewer assignments,
 * recording candidate feedback scores, and interview stage transitions.
 */
public interface InterviewService {

    /**
     * Schedules a technical or behavioral interview for a candidate application.
     *
     * @param recruiterUserId User ID scheduling the interview.
     * @param interviewDto Interview schedule payload.
     * @return InterviewDto scheduled interview payload.
     */
    InterviewDto scheduleInterview(Long recruiterUserId, InterviewDto interviewDto);

    /**
     * Updates scheduled interview details or status (e.g. COMPLETED, CANCELLED, RESCHEDULED).
     *
     * @param recruiterUserId Recruiter User ID.
     * @param interviewId Interview ID.
     * @param interviewDto Updated interview details.
     * @return InterviewDto updated payload.
     */
    InterviewDto updateInterview(Long recruiterUserId, Long interviewId, InterviewDto interviewDto);

    /**
     * Submits interviewer evaluation score and feedback notes.
     *
     * @param interviewerUserId User ID of interviewer.
     * @param interviewId Interview ID.
     * @param feedback Notes and scoring rubric.
     * @param rating Integer rating (1-5).
     * @return InterviewDto updated payload.
     */
    InterviewDto submitInterviewFeedback(Long interviewerUserId, Long interviewId, String feedback, Integer rating);

    /**
     * Retrieves upcoming scheduled interviews for candidate.
     *
     * @param candidateUserId Candidate User ID.
     * @return List of InterviewDto items.
     */
    List<InterviewDto> getCandidateInterviews(Long candidateUserId);

    /**
     * Retrieves all interviews associated with a job application.
     *
     * @param applicationId Target Application ID.
     * @return List of InterviewDto items.
     */
    List<InterviewDto> getApplicationInterviews(Long applicationId);
}
