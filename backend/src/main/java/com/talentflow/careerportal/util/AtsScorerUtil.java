package com.talentflow.careerportal.util;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

/**
 * Enterprise Applicant Tracking System (ATS) scoring utility calculating profile
 * keyword density, experience weight, education alignment, and overall fit score.
 */
public final class AtsScorerUtil {

    private AtsScorerUtil() {
        // Private constructor
    }

    /**
     * Calculates comprehensive ATS match score (0-100) combining skills, experience years,
     * and education qualification levels.
     *
     * @param candidateSkills List of candidate skill tags.
     * @param requiredSkills List of job required skills.
     * @param candidateExpYears Candidate's total years of experience.
     * @param requiredMinExp Minimum required years of experience.
     * @return Integer overall ATS match percentage.
     */
    public static int calculateComprehensiveAtsScore(
            List<String> candidateSkills,
            List<String> requiredSkills,
            Integer candidateExpYears,
            Integer requiredMinExp) {

        double skillScore = SkillMatcherUtil.calculateMatchPercentage(candidateSkills, requiredSkills);

        double expScore = 100.0;
        if (requiredMinExp != null && requiredMinExp > 0) {
            int actualExp = (candidateExpYears != null) ? candidateExpYears : 0;
            if (actualExp >= requiredMinExp) {
                expScore = 100.0;
            } else {
                expScore = Math.max(20.0, (actualExp / (double) requiredMinExp) * 100.0);
            }
        }

        // Weighted calculation: 70% Skills Match, 30% Experience Match
        double totalWeightedScore = (skillScore * 0.70) + (expScore * 0.30);
        return (int) Math.round(totalWeightedScore);
    }

    /**
     * Extracts missing critical keywords between job description text and candidate resume text.
     *
     * @param resumeText Plain text resume.
     * @param jobDescription Text job description.
     * @return List of missing high-frequency keywords.
     */
    public static List<String> extractMissingKeywords(String resumeText, String jobDescription) {
        if (jobDescription == null || jobDescription.isBlank()) return new ArrayList<>();
        if (resumeText == null) resumeText = "";

        String normalizedResume = resumeText.toLowerCase();
        Set<String> jobWords = Arrays.stream(jobDescription.toLowerCase().split("\\W+"))
                .filter(w -> w.length() > 3)
                .filter(w -> !isCommonStopword(w))
                .collect(Collectors.toSet());

        List<String> missing = new ArrayList<>();
        for (String word : jobWords) {
            if (!normalizedResume.contains(word)) {
                missing.add(word);
            }
        }

        return missing.stream().limit(10).collect(Collectors.toList());
    }

    private static boolean isCommonStopword(String word) {
        Set<String> stopwords = new HashSet<>(Arrays.asList(
                "with", "that", "this", "from", "have", "will", "your", "they", "been",
                "team", "work", "role", "years", "must", "able", "requirements", "about"
        ));
        return stopwords.contains(word);
    }
}
