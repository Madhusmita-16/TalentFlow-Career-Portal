package com.talentflow.careerportal.service;

import com.talentflow.careerportal.dto.CopilotMatchRequestDTO;
import com.talentflow.careerportal.dto.CopilotMatchResponseDTO;
import com.talentflow.careerportal.service.impl.CopilotAIServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Enterprise JUnit 5 test suite for CopilotAIServiceImpl testing ATS match scoring,
 * skill gap recommendations, resume bullet generator, and career roadmaps.
 */
@ExtendWith(MockitoExtension.class)
public class CopilotAIServiceTest {

    @Mock
    private AuditService auditService;

    @InjectMocks
    private CopilotAIServiceImpl copilotAIService;

    @Test
    @DisplayName("Should analyze candidate job match and return accurate match percentage and skill gap")
    void analyzeCandidateJobMatch_HighMatch() {
        CopilotMatchRequestDTO request = new CopilotMatchRequestDTO();
        request.setCandidateSkills(List.of("Java", "Spring Boot", "React", "TypeScript", "SQL"));
        request.setRequiredSkills(List.of("Java", "Spring Boot", "TypeScript"));

        CopilotMatchResponseDTO response = copilotAIService.analyzeCandidateJobMatch(request);

        assertNotNull(response);
        assertEquals(100, response.getMatchPercentage());
        assertEquals(3, response.getMatchingSkills().size());
        assertTrue(response.getMissingSkills().isEmpty());
    }

    @Test
    @DisplayName("Should generate resume enhancement suggestions for target role")
    void generateResumeEnhancementSuggestions_Success() {
        List<String> suggestions = copilotAIService.generateResumeEnhancementSuggestions(
                "Engineered Java REST APIs", "Senior Backend Engineer");

        assertNotNull(suggestions);
        assertFalse(suggestions.isEmpty());
        assertTrue(suggestions.get(0).contains("Senior Backend Engineer"));
    }

    @Test
    @DisplayName("Should generate interview prep questions for position")
    void generateInterviewPreparationQuestions_Success() {
        List<String> questions = copilotAIService.generateInterviewPreparationQuestions(
                "Full Stack Architect", "Senior");

        assertNotNull(questions);
        assertEquals(4, questions.size());
    }
}
