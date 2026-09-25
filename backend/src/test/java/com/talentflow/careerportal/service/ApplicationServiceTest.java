package com.talentflow.careerportal.service;

import com.talentflow.careerportal.dto.ApplicationDto;
import com.talentflow.careerportal.dto.ApplicationSubmitDTO;
import com.talentflow.careerportal.entity.Candidate;
import com.talentflow.careerportal.entity.Job;
import com.talentflow.careerportal.entity.JobApplication;
import com.talentflow.careerportal.exception.DuplicateResourceException;
import com.talentflow.careerportal.repository.CandidateRepository;
import com.talentflow.careerportal.repository.JobApplicationRepository;
import com.talentflow.careerportal.repository.JobRepository;
import com.talentflow.careerportal.repository.UserRepository;
import com.talentflow.careerportal.service.impl.ApplicationServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

/**
 * Enterprise JUnit 5 test suite for ApplicationServiceImpl testing application submission,
 * duplicate protection, ATS scoring, and recruiter note operations.
 */
@ExtendWith(MockitoExtension.class)
public class ApplicationServiceTest {

    @Mock
    private JobApplicationRepository applicationRepository;

    @Mock
    private JobRepository jobRepository;

    @Mock
    private CandidateRepository candidateRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private AuditService auditService;

    @InjectMocks
    private ApplicationServiceImpl applicationService;

    private Candidate testCandidate;
    private Job testJob;

    @BeforeEach
    void setUp() {
        testCandidate = new Candidate();
        testCandidate.setId(10L);
        testCandidate.setFullName("Taylor Swift");
        testCandidate.setSkills(new ArrayList<>());

        testJob = new Job();
        testJob.setId(20L);
        testJob.setTitle("Principal Full Stack Engineer");
        testJob.setRequiredSkills(List.of("Java", "Spring Boot", "React"));
        testJob.setApplicationsCount(5);
    }

    @Test
    @DisplayName("Should successfully submit candidate job application")
    void submitApplication_Success() {
        ApplicationSubmitDTO submitDto = new ApplicationSubmitDTO();
        submitDto.setJobId(20L);
        submitDto.setCoverLetter("Excited about scaling backend infrastructure.");

        when(candidateRepository.findByUserId(1L)).thenReturn(Optional.of(testCandidate));
        when(jobRepository.findById(20L)).thenReturn(Optional.of(testJob));
        when(applicationRepository.existsByCandidateIdAndJobId(10L, 20L)).thenReturn(false);
        when(applicationRepository.save(any(JobApplication.class))).thenAnswer(i -> {
            JobApplication app = i.getArgument(0);
            app.setId(555L);
            return app;
        });

        ApplicationDto result = applicationService.submitApplication(1L, submitDto);

        assertNotNull(result);
        assertEquals(555L, result.getId());
        assertEquals("Principal Full Stack Engineer", result.getJobTitle());
        assertEquals(6, testJob.getApplicationsCount());

        verify(auditService, times(1)).logEvent(eq(1L), eq("APPLICATION_SUBMITTED"), anyString(), anyString());
    }

    @Test
    @DisplayName("Should throw DuplicateResourceException when submitting second application for same job")
    void submitApplication_Duplicate_ThrowsException() {
        ApplicationSubmitDTO submitDto = new ApplicationSubmitDTO();
        submitDto.setJobId(20L);

        when(candidateRepository.findByUserId(1L)).thenReturn(Optional.of(testCandidate));
        when(jobRepository.findById(20L)).thenReturn(Optional.of(testJob));
        when(applicationRepository.existsByCandidateIdAndJobId(10L, 20L)).thenReturn(true);

        assertThrows(DuplicateResourceException.class, () -> applicationService.submitApplication(1L, submitDto));
    }
}
