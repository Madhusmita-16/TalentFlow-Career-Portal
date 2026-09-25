package com.talentflow.careerportal.service;

import com.talentflow.careerportal.dto.TechnicalAssessmentDto;
import com.talentflow.careerportal.entity.Candidate;
import com.talentflow.careerportal.entity.Job;
import com.talentflow.careerportal.entity.TechnicalAssessment;
import com.talentflow.careerportal.repository.CandidateRepository;
import com.talentflow.careerportal.repository.JobRepository;
import com.talentflow.careerportal.repository.TechnicalAssessmentRepository;
import com.talentflow.careerportal.service.impl.AssessmentServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

/**
 * JUnit 5 test suite for AssessmentServiceImpl.
 */
@ExtendWith(MockitoExtension.class)
public class AssessmentServiceTest {

    @Mock
    private TechnicalAssessmentRepository assessmentRepository;

    @Mock
    private CandidateRepository candidateRepository;

    @Mock
    private JobRepository jobRepository;

    @Mock
    private AuditService auditService;

    @InjectMocks
    private AssessmentServiceImpl assessmentService;

    private Candidate candidate;
    private Job job;

    @BeforeEach
    void setUp() {
        candidate = new Candidate();
        candidate.setId(10L);
        candidate.setFullName("Alex Morgan");

        job = new Job();
        job.setId(20L);
        job.setTitle("Senior Full Stack Developer");
    }

    @Test
    @DisplayName("Should assign technical coding assessment to candidate")
    void assignAssessment_Success() {
        when(candidateRepository.findById(10L)).thenReturn(Optional.of(candidate));
        when(jobRepository.findById(20L)).thenReturn(Optional.of(job));
        when(assessmentRepository.save(any(TechnicalAssessment.class))).thenAnswer(i -> {
            TechnicalAssessment ta = i.getArgument(0);
            ta.setId(99L);
            return ta;
        });

        TechnicalAssessmentDto result = assessmentService.assignAssessment(10L, 20L, "Java Microservices Exam");

        assertNotNull(result);
        assertEquals(99L, result.getId());
        assertEquals("Java Microservices Exam", result.getAssessmentName());
    }
}
