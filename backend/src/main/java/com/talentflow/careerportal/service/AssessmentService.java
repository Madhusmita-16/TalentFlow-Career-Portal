package com.talentflow.careerportal.service;

import com.talentflow.careerportal.dto.TechnicalAssessmentDto;

import java.util.List;

/**
 * Service interface managing candidate technical assessments, scoring rubrics, and grading.
 */
public interface AssessmentService {

    /**
     * Assigns a new technical coding assessment to candidate for job position.
     *
     * @param candidateId Candidate entity ID.
     * @param jobId Target Job ID.
     * @param assessmentName Assessment test title.
     * @return TechnicalAssessmentDto assigned assessment payload.
     */
    TechnicalAssessmentDto assignAssessment(Long candidateId, Long jobId, String assessmentName);

    /**
     * Submits candidate score and evaluator feedback for technical assessment.
     *
     * @param assessmentId Assessment ID.
     * @param score Integer score obtained.
     * @param feedback Evaluator feedback string.
     * @return TechnicalAssessmentDto updated payload.
     */
    TechnicalAssessmentDto submitAssessmentScore(Long assessmentId, Integer score, String feedback);

    /**
     * Retrieves all technical assessments assigned to a candidate.
     *
     * @param candidateId Candidate entity ID.
     * @return List of TechnicalAssessmentDto items.
     */
    List<TechnicalAssessmentDto> getCandidateAssessments(Long candidateId);
}
