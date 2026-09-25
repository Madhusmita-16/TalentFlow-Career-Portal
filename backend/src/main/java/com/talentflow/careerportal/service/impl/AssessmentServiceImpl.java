package com.talentflow.careerportal.service.impl;

import com.talentflow.careerportal.dto.TechnicalAssessmentDto;
import com.talentflow.careerportal.entity.Candidate;
import com.talentflow.careerportal.entity.Job;
import com.talentflow.careerportal.entity.TechnicalAssessment;
import com.talentflow.careerportal.exception.ResourceNotFoundException;
import com.talentflow.careerportal.repository.CandidateRepository;
import com.talentflow.careerportal.repository.JobRepository;
import com.talentflow.careerportal.repository.TechnicalAssessmentRepository;
import com.talentflow.careerportal.service.AssessmentService;
import com.talentflow.careerportal.service.AuditService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Enterprise implementation of AssessmentService.
 */
@Service
@Transactional
public class AssessmentServiceImpl implements AssessmentService {

    private final TechnicalAssessmentRepository assessmentRepository;
    private final CandidateRepository candidateRepository;
    private final JobRepository jobRepository;
    private final AuditService auditService;

    @Autowired
    public AssessmentServiceImpl(TechnicalAssessmentRepository assessmentRepository,
                                 CandidateRepository candidateRepository,
                                 JobRepository jobRepository,
                                 AuditService auditService) {
        this.assessmentRepository = assessmentRepository;
        this.candidateRepository = candidateRepository;
        this.jobRepository = jobRepository;
        this.auditService = auditService;
    }

    @Override
    public TechnicalAssessmentDto assignAssessment(Long candidateId, Long jobId, String assessmentName) {
        Candidate candidate = candidateRepository.findById(candidateId)
                .orElseThrow(() -> new ResourceNotFoundException("Candidate", "id", candidateId));

        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job", "id", jobId));

        TechnicalAssessment assessment = new TechnicalAssessment();
        assessment.setCandidate(candidate);
        assessment.setJob(job);
        assessment.setAssessmentName(assessmentName != null ? assessmentName : "Full Stack Coding Challenge");
        assessment.setStatus(TechnicalAssessment.AssessmentStatus.PENDING);
        assessment.setAssignedAt(LocalDateTime.now());

        TechnicalAssessment saved = assessmentRepository.save(assessment);
        auditService.logEvent(null, "ASSESSMENT_ASSIGNED", "Assigned assessment to candidate: " + candidateId, "ASSESSMENT_SERVICE");
        return mapToDto(saved);
    }

    @Override
    public TechnicalAssessmentDto submitAssessmentScore(Long assessmentId, Integer score, String feedback) {
        TechnicalAssessment assessment = assessmentRepository.findById(assessmentId)
                .orElseThrow(() -> new ResourceNotFoundException("TechnicalAssessment", "id", assessmentId));

        assessment.setScore(score);
        assessment.setEvaluatorFeedback(feedback);
        assessment.setCompletedAt(LocalDateTime.now());

        if (score != null && score >= 70) {
            assessment.setStatus(TechnicalAssessment.AssessmentStatus.PASSED);
        } else {
            assessment.setStatus(TechnicalAssessment.AssessmentStatus.FAILED);
        }

        TechnicalAssessment saved = assessmentRepository.save(assessment);
        auditService.logEvent(null, "ASSESSMENT_SUBMITTED", "Submitted score for assessment: " + assessmentId, "ASSESSMENT_SERVICE");
        return mapToDto(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public List<TechnicalAssessmentDto> getCandidateAssessments(Long candidateId) {
        List<TechnicalAssessment> list = assessmentRepository.findByCandidateId(candidateId);
        return list.stream().map(this::mapToDto).collect(Collectors.toList());
    }

    private TechnicalAssessmentDto mapToDto(TechnicalAssessment assessment) {
        TechnicalAssessmentDto dto = new TechnicalAssessmentDto();
        dto.setId(assessment.getId());
        dto.setCandidateId(assessment.getCandidate() != null ? assessment.getCandidate().getId() : null);
        dto.setCandidateName(assessment.getCandidate() != null ? assessment.getCandidate().getFullName() : "");
        dto.setJobId(assessment.getJob() != null ? assessment.getJob().getId() : null);
        dto.setJobTitle(assessment.getJob() != null ? assessment.getJob().getTitle() : "");
        dto.setAssessmentName(assessment.getAssessmentName());
        dto.setScore(assessment.getScore());
        dto.setMaxScore(assessment.getMaxScore());
        dto.setStatus(assessment.getStatus() != null ? assessment.getStatus().name() : "PENDING");
        dto.setCompletionTimeMinutes(assessment.getCompletionTimeMinutes());
        dto.setEvaluatorFeedback(assessment.getEvaluatorFeedback());
        dto.setAssignedAt(assessment.getAssignedAt());
        dto.setCompletedAt(assessment.getCompletedAt());
        return dto;
    }
}
