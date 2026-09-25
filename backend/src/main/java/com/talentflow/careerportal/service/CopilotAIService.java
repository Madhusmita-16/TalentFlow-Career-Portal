package com.talentflow.careerportal.service;

import com.talentflow.careerportal.dto.CopilotMatchRequestDTO;
import com.talentflow.careerportal.dto.CopilotMatchResponseDTO;

import java.util.List;

/**
 * Service interface for AI Copilot career recommendations, ATS resume optimization,
 * candidate-to-job matching analysis, and mock interview question generation.
 */
public interface CopilotAIService {

    /**
     * Performs AI candidate-to-job matching and returns match score, skill breakdown,
     * missing keywords, and recommended profile highlights.
     *
     * @param request Payload containing candidate skills/profile and target job description/skills.
     * @return CopilotMatchResponseDTO AI analysis and match breakdown.
     */
    CopilotMatchResponseDTO analyzeCandidateJobMatch(CopilotMatchRequestDTO request);

    /**
     * Generates personalized resume bullet point enhancements based on candidate role and target domain.
     *
     * @param currentExperience Current text description of candidate experience.
     * @param targetRole Target role title.
     * @return List of AI-suggested quantifiable bullet points.
     */
    List<String> generateResumeEnhancementSuggestions(String currentExperience, String targetRole);

    /**
     * Generates domain-specific interview preparation questions and sample answer frameworks.
     *
     * @param jobTitle Target position title.
     * @param seniority Seniority level (e.g. Senior, Mid, Junior).
     * @return List of interview question prompts.
     */
    List<String> generateInterviewPreparationQuestions(String jobTitle, String seniority);

    /**
     * Generates career progression roadmap advice for candidate profile.
     *
     * @param currentTitle Current job title.
     * @param targetTitle Desired target job title.
     * @param currentSkills List of current candidate skills.
     * @return Markdown-formatted career roadmap string.
     */
    String generateCareerRoadmap(String currentTitle, String targetTitle, List<String> currentSkills);
}
