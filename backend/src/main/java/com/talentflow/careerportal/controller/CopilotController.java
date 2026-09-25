package com.talentflow.careerportal.controller;

import com.talentflow.careerportal.dto.ApiResponse;
import com.talentflow.careerportal.dto.CopilotMatchRequestDTO;
import com.talentflow.careerportal.dto.CopilotMatchResponseDTO;
import com.talentflow.careerportal.service.CopilotAIService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST Controller exposing AI Copilot endpoints for ATS resume matching,
 * resume optimization suggestions, mock interview questions, and career roadmaps.
 */
@RestController
@RequestMapping("/api/copilot")
@CrossOrigin(origins = "*", maxAge = 3600)
public class CopilotController {

    private final CopilotAIService copilotAIService;

    @Autowired
    public CopilotController(CopilotAIService copilotAIService) {
        this.copilotAIService = copilotAIService;
    }

    /**
     * Endpoint for AI candidate-to-job ATS match analysis.
     *
     * @param request Match request payload containing candidate skills and job criteria.
     * @return ResponseEntity with CopilotMatchResponseDTO.
     */
    @PostMapping("/match-analysis")
    public ResponseEntity<ApiResponse<CopilotMatchResponseDTO>> analyzeMatch(@RequestBody CopilotMatchRequestDTO request) {
        CopilotMatchResponseDTO result = copilotAIService.analyzeCandidateJobMatch(request);
        return ResponseEntity.ok(ApiResponse.success(result, "Match analysis generated successfully."));
    }

    /**
     * Endpoint for generating resume bullet point enhancement suggestions.
     *
     * @param currentExperience Candidate's raw experience description text.
     * @param targetRole Target role title.
     * @return ResponseEntity with list of suggested bullet points.
     */
    @GetMapping("/resume-suggestions")
    public ResponseEntity<ApiResponse<List<String>>> getResumeSuggestions(
            @RequestParam(required = false) String currentExperience,
            @RequestParam(required = false, defaultValue = "Software Engineer") String targetRole) {
        List<String> suggestions = copilotAIService.generateResumeEnhancementSuggestions(currentExperience, targetRole);
        return ResponseEntity.ok(ApiResponse.success(suggestions, "Resume enhancements generated successfully."));
    }

    /**
     * Endpoint for generating role-specific mock interview preparation questions.
     *
     * @param jobTitle Target position title.
     * @param seniority Seniority level (Senior, Mid, Junior).
     * @return ResponseEntity with list of interview question prompts.
     */
    @GetMapping("/interview-questions")
    public ResponseEntity<ApiResponse<List<String>>> getInterviewQuestions(
            @RequestParam(required = false, defaultValue = "Software Engineer") String jobTitle,
            @RequestParam(required = false, defaultValue = "Mid-Level") String seniority) {
        List<String> questions = copilotAIService.generateInterviewPreparationQuestions(jobTitle, seniority);
        return ResponseEntity.ok(ApiResponse.success(questions, "Interview questions generated successfully."));
    }

    /**
     * Endpoint for generating a personalized career progression roadmap.
     *
     * @param currentTitle Candidate's current role title.
     * @param targetTitle Desired target role title.
     * @return ResponseEntity with Markdown roadmap content string.
     */
    @GetMapping("/career-roadmap")
    public ResponseEntity<ApiResponse<String>> getCareerRoadmap(
            @RequestParam(required = false, defaultValue = "Junior Developer") String currentTitle,
            @RequestParam(required = false, defaultValue = "Lead Architect") String targetTitle) {
        String roadmap = copilotAIService.generateCareerRoadmap(currentTitle, targetTitle, List.of("Java", "React"));
        return ResponseEntity.ok(ApiResponse.success(roadmap, "Career roadmap generated successfully."));
    }
}
