package com.talentflow.careerportal.service;

import com.talentflow.careerportal.dto.CandidateProfileDTO;
import com.talentflow.careerportal.dto.CandidateUpdateDTO;
import com.talentflow.careerportal.dto.WorkExperienceDto;
import com.talentflow.careerportal.entity.Candidate;
import com.talentflow.careerportal.entity.User;
import com.talentflow.careerportal.exception.ResourceNotFoundException;
import com.talentflow.careerportal.repository.CandidateRepository;
import com.talentflow.careerportal.repository.UserRepository;
import com.talentflow.careerportal.service.impl.CandidateServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

/**
 * Enterprise JUnit 5 test suite for CandidateServiceImpl testing profile retrieval,
 * candidate updates, work experience additions, and profile completeness calculations.
 */
@ExtendWith(MockitoExtension.class)
public class CandidateServiceTest {

    @Mock
    private CandidateRepository candidateRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private AuditService auditService;

    @InjectMocks
    private CandidateServiceImpl candidateService;

    private Candidate testCandidate;
    private User testUser;

    @BeforeEach
    void setUp() {
        testUser = new User();
        testUser.setId(10L);
        testUser.setEmail("jordan.lee@example.com");
        testUser.setFullName("Jordan Lee");

        testCandidate = new Candidate();
        testCandidate.setId(100L);
        testCandidate.setUser(testUser);
        testCandidate.setFullName("Jordan Lee");
        testCandidate.setEmail("jordan.lee@example.com");
        testCandidate.setHeadline("Senior Full Stack Engineer");
        testCandidate.setLocation("San Francisco, CA");
        testCandidate.setBio("Passionate developer building enterprise web platforms.");
        testCandidate.setExperiences(new ArrayList<>());
        testCandidate.setEducationList(new ArrayList<>());
        testCandidate.setSkills(new ArrayList<>());
        testCandidate.setProfileCompletionPercentage(60);
    }

    @Test
    @DisplayName("Should successfully retrieve candidate profile by candidate ID")
    void getCandidateProfileById_Success() {
        when(candidateRepository.findById(100L)).thenReturn(Optional.of(testCandidate));

        CandidateProfileDTO result = candidateService.getCandidateProfileById(100L);

        assertNotNull(result);
        assertEquals(100L, result.getId());
        assertEquals("Jordan Lee", result.getFullName());
        assertEquals("Senior Full Stack Engineer", result.getHeadline());
    }

    @Test
    @DisplayName("Should throw ResourceNotFoundException when candidate ID does not exist")
    void getCandidateProfileById_NotFound_ThrowsException() {
        when(candidateRepository.findById(999L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> candidateService.getCandidateProfileById(999L));
    }

    @Test
    @DisplayName("Should successfully update candidate profile details and recalculate completeness")
    void updateCandidateProfile_Success() {
        CandidateUpdateDTO updateDto = new CandidateUpdateDTO();
        updateDto.setHeadline("Lead Principal Architect");
        updateDto.setLocation("New York, NY");
        updateDto.setBio("Updated bio description.");
        updateDto.setSkills(List.of("Java", "Spring Boot", "TypeScript", "React"));

        when(candidateRepository.findByUserId(10L)).thenReturn(Optional.of(testCandidate));
        when(candidateRepository.save(any(Candidate.class))).thenAnswer(i -> i.getArgument(0));

        CandidateProfileDTO updated = candidateService.updateCandidateProfile(10L, updateDto);

        assertNotNull(updated);
        assertEquals("Lead Principal Architect", updated.getHeadline());
        assertEquals("New York, NY", updated.getLocation());
        assertEquals(4, updated.getSkills().size());

        verify(auditService, times(1)).logEvent(eq(10L), eq("CANDIDATE_PROFILE_UPDATED"), anyString(), anyString());
    }

    @Test
    @DisplayName("Should add work experience entry to candidate profile")
    void addWorkExperience_Success() {
        WorkExperienceDto expDto = new WorkExperienceDto();
        expDto.setCompany("Stripe");
        expDto.setPosition("Senior Backend Engineer");
        expDto.setLocation("San Francisco, CA");
        expDto.setStartDate(LocalDate.of(2021, 3, 1));
        expDto.setIsCurrent(true);
        expDto.setDescription("Building payment gateway APIs.");

        when(candidateRepository.findByUserId(10L)).thenReturn(Optional.of(testCandidate));
        when(candidateRepository.save(any(Candidate.class))).thenAnswer(i -> i.getArgument(0));

        CandidateProfileDTO updated = candidateService.addWorkExperience(10L, expDto);

        assertNotNull(updated);
        assertEquals(1, updated.getExperiences().size());
        assertEquals("Stripe", updated.getExperiences().get(0).getCompany());

        verify(auditService, times(1)).logEvent(eq(10L), eq("WORK_EXPERIENCE_ADDED"), anyString(), anyString());
    }

    @Test
    @DisplayName("Should calculate profile completeness percentage accurately")
    void calculateProfileCompleteness_AccurateScore() {
        testCandidate.setAvatarUrl("https://example.com/avatar.jpg");
        testCandidate.setHeadline("Full Stack Engineer");
        testCandidate.setBio("Tech enthusiast.");
        testCandidate.setResumeUrl("https://example.com/resume.pdf");

        int score = candidateService.calculateProfileCompleteness(testCandidate);
        assertTrue(score >= 75);
    }
}
