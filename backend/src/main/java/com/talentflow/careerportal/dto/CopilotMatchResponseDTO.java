package com.talentflow.careerportal.dto;

import java.util.List;

public class CopilotMatchResponseDTO {
    private int matchPercentage;
    private String matchTier;
    private List<String> matchingSkills;
    private List<String> recommendedSkillsToLearn;
    private String aiRecommendationSummary;

    public CopilotMatchResponseDTO() {
    }

    public CopilotMatchResponseDTO(int matchPercentage, String matchTier, List<String> matchingSkills, List<String> recommendedSkillsToLearn, String aiRecommendationSummary) {
        this.matchPercentage = matchPercentage;
        this.matchTier = matchTier;
        this.matchingSkills = matchingSkills;
        this.recommendedSkillsToLearn = recommendedSkillsToLearn;
        this.aiRecommendationSummary = aiRecommendationSummary;
    }

    public int getMatchPercentage() {
        return matchPercentage;
    }

    public void setMatchPercentage(int matchPercentage) {
        this.matchPercentage = matchPercentage;
    }

    public String getMatchTier() {
        return matchTier;
    }

    public void setMatchTier(String matchTier) {
        this.matchTier = matchTier;
    }

    public List<String> getMatchingSkills() {
        return matchingSkills;
    }

    public void setMatchingSkills(List<String> matchingSkills) {
        this.matchingSkills = matchingSkills;
    }

    public List<String> getRecommendedSkillsToLearn() {
        return recommendedSkillsToLearn;
    }

    public void setRecommendedSkillsToLearn(List<String> recommendedSkillsToLearn) {
        this.recommendedSkillsToLearn = recommendedSkillsToLearn;
    }

    public String getAiRecommendationSummary() {
        return aiRecommendationSummary;
    }

    public void setAiRecommendationSummary(String aiRecommendationSummary) {
        this.aiRecommendationSummary = aiRecommendationSummary;
    }
}
