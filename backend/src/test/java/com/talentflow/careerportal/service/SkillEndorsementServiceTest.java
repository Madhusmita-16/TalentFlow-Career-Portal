package com.talentflow.careerportal.service;

import com.talentflow.careerportal.dto.SkillEndorsementDto;
import com.talentflow.careerportal.entity.Candidate;
import com.talentflow.careerportal.entity.SkillEndorsement;
import com.talentflow.careerportal.repository.CandidateRepository;
import com.talentflow.careerportal.repository.SkillEndorsementRepository;
import com.talentflow.careerportal.service.impl.SkillEndorsementServiceImpl;
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
 * JUnit 5 test suite for SkillEndorsementServiceImpl.
 */
@ExtendWith(MockitoExtension.class)
public class SkillEndorsementServiceTest {

    @Mock
    private SkillEndorsementRepository endorsementRepository;

    @Mock
    private CandidateRepository candidateRepository;

    @Mock
    private AuditService auditService;

    @InjectMocks
    private SkillEndorsementServiceImpl endorsementService;

    private Candidate candidate;

    @BeforeEach
    void setUp() {
        candidate = new Candidate();
        candidate.setId(10L);
        candidate.setFullName("Alex Morgan");
    }

    @Test
    @DisplayName("Should endorse candidate skill and return SkillEndorsementDto")
    void endorseSkill_Success() {
        when(candidateRepository.findById(10L)).thenReturn(Optional.of(candidate));
        when(endorsementRepository.save(any(SkillEndorsement.class))).thenAnswer(i -> {
            SkillEndorsement se = i.getArgument(0);
            se.setId(55L);
            return se;
        });

        SkillEndorsementDto result = endorsementService.endorseSkill(10L, "Java", "Sarah Recruiter", "Lead Manager");

        assertNotNull(result);
        assertEquals(55L, result.getId());
        assertEquals("Java", result.getSkillName());
        assertEquals("Sarah Recruiter", result.getEndorserName());
    }
}
