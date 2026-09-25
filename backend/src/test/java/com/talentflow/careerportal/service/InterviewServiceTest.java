package com.talentflow.careerportal.service;

import com.talentflow.careerportal.dto.InterviewDto;
import com.talentflow.careerportal.entity.Interview;
import com.talentflow.careerportal.entity.JobApplication;
import com.talentflow.careerportal.repository.CandidateRepository;
import com.talentflow.careerportal.repository.InterviewRepository;
import com.talentflow.careerportal.repository.JobApplicationRepository;
import com.talentflow.careerportal.service.impl.InterviewServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

/**
 * JUnit 5 test suite for InterviewServiceImpl.
 */
@ExtendWith(MockitoExtension.class)
public class InterviewServiceTest {

    @Mock
    private InterviewRepository interviewRepository;

    @Mock
    private JobApplicationRepository applicationRepository;

    @Mock
    private CandidateRepository candidateRepository;

    @Mock
    private NotificationService notificationService;

    @Mock
    private AuditService auditService;

    @InjectMocks
    private InterviewServiceImpl interviewService;

    private JobApplication testApp;

    @BeforeEach
    void setUp() {
        testApp = new JobApplication();
        testApp.setId(50L);
    }

    @Test
    @DisplayName("Should schedule technical interview and send candidate notification")
    void scheduleInterview_Success() {
        InterviewDto dto = new InterviewDto();
        dto.setApplicationId(50L);
        dto.setTitle("Backend Technical Interview");
        dto.setScheduledTime(LocalDateTime.now().plusDays(2));

        when(applicationRepository.findById(50L)).thenReturn(Optional.of(testApp));
        when(interviewRepository.save(any(Interview.class))).thenAnswer(i -> {
            Interview inv = i.getArgument(0);
            inv.setId(101L);
            return inv;
        });

        InterviewDto result = interviewService.scheduleInterview(1L, dto);

        assertNotNull(result);
        assertEquals(101L, result.getId());
        assertEquals("Backend Technical Interview", result.getTitle());
    }
}
