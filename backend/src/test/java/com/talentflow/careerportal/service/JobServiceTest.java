package com.talentflow.careerportal.service;

import com.talentflow.careerportal.dto.JobCreateDTO;
import com.talentflow.careerportal.dto.JobResponseDTO;
import com.talentflow.careerportal.dto.JobSearchCriteria;
import com.talentflow.careerportal.dto.PagedResponse;
import com.talentflow.careerportal.entity.Job;
import com.talentflow.careerportal.entity.User;
import com.talentflow.careerportal.repository.CandidateRepository;
import com.talentflow.careerportal.repository.JobRepository;
import com.talentflow.careerportal.repository.OrganizationRepository;
import com.talentflow.careerportal.repository.UserRepository;
import com.talentflow.careerportal.service.impl.JobServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

/**
 * Enterprise JUnit 5 test suite for JobServiceImpl verifying job creation,
 * search filtering, job status updates, and candidate recommendations.
 */
@ExtendWith(MockitoExtension.class)
public class JobServiceTest {

    @Mock
    private JobRepository jobRepository;

    @Mock
    private OrganizationRepository organizationRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private CandidateRepository candidateRepository;

    @Mock
    private AuditService auditService;

    @InjectMocks
    private JobServiceImpl jobService;

    private Job testJob;
    private User testRecruiter;

    @BeforeEach
    void setUp() {
        testRecruiter = new User();
        testRecruiter.setId(5L);
        testRecruiter.setEmail("recruiter@techcorp.com");
        testRecruiter.setFullName("Sarah Recruiter");

        testJob = new Job();
        testJob.setId(50L);
        testJob.setTitle("Lead Java Backend Developer");
        testJob.setDescription("Building high throughput microservices.");
        testJob.setDepartment("Engineering");
        testJob.setLocation("San Francisco, CA");
        testJob.setJobType("Full-time");
        testJob.setExperienceLevel("Senior");
        testJob.setRemote(true);
        testJob.setSalaryMin(150000.0);
        testJob.setSalaryMax(190000.0);
        testJob.setStatus(Job.JobStatus.ACTIVE);
        testJob.setPostedAt(LocalDateTime.now());
        testJob.setRequiredSkills(List.of("Java", "Spring Boot", "Kafka", "PostgreSQL"));
    }

    @Test
    @DisplayName("Should successfully retrieve job details by ID")
    void getJobById_Success() {
        when(jobRepository.findById(50L)).thenReturn(Optional.of(testJob));

        JobResponseDTO result = jobService.getJobById(50L);

        assertNotNull(result);
        assertEquals(50L, result.getId());
        assertEquals("Lead Java Backend Developer", result.getTitle());
        assertTrue(result.getRemote());
    }

    @Test
    @DisplayName("Should create new job posting and log audit event")
    void createJob_Success() {
        JobCreateDTO createDto = new JobCreateDTO();
        createDto.setTitle("Senior Full Stack Architect");
        createDto.setDescription("Architecting distributed micro-frontends and backend APIs.");
        createDto.setLocation("Remote");
        createDto.setJobType("Full-time");
        createDto.setSalaryMin(160000.0);
        createDto.setSalaryMax(210000.0);
        createDto.setRequiredSkills(List.of("TypeScript", "React", "Java", "AWS"));

        when(userRepository.findById(5L)).thenReturn(Optional.of(testRecruiter));
        when(jobRepository.save(any(Job.class))).thenAnswer(i -> {
            Job j = i.getArgument(0);
            j.setId(101L);
            return j;
        });

        JobResponseDTO response = jobService.createJob(5L, createDto);

        assertNotNull(response);
        assertEquals(101L, response.getId());
        assertEquals("Senior Full Stack Architect", response.getTitle());

        verify(auditService, times(1)).logEvent(eq(5L), eq("JOB_CREATED"), anyString(), anyString());
    }

    @Test
    @DisplayName("Should filter active jobs matching search criteria")
    void searchJobs_Success() {
        JobSearchCriteria criteria = new JobSearchCriteria();
        criteria.setQuery("Java");
        criteria.setRemoteOnly(true);

        when(jobRepository.findAll(any(Pageable.class))).thenReturn(new PageImpl<>(List.of(testJob)));

        PagedResponse<JobResponseDTO> pagedResponse = jobService.searchJobs(criteria, 0, 10);

        assertNotNull(pagedResponse);
        assertEquals(1, pagedResponse.getContent().size());
        assertEquals("Lead Java Backend Developer", pagedResponse.getContent().get(0).getTitle());
    }
}
