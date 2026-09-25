package com.talentflow.careerportal.util;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

/**
 * Enterprise utility for extracting contact information, skill tags, work experience years,
 * and educational credentials from raw unformatted candidate resume text.
 */
public final class ResumeTextExtractorUtil {

    private static final Pattern EMAIL_PATTERN = Pattern.compile("[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,6}");
    private static final Pattern PHONE_PATTERN = Pattern.compile("\\+?[0-9]{1,4}?[-. ]?\\(?([0-9]{1,3})\\)?[-. ]?([0-9]{1,4})[-. ]?([0-9]{1,9})");
    private static final Pattern EXP_YEARS_PATTERN = Pattern.compile("(\\d+)\\+?\\s*(?:years?|yrs?)\\s*(?:of)?\\s*experience", Pattern.CASE_INSENSITIVE);

    private static final Set<String> KNOWN_TECH_SKILLS = new HashSet<>(Arrays.asList(
            "java", "spring boot", "spring cloud", "hibernate", "jpa", "microservices", "rest api",
            "graphql", "kafka", "rabbitmq", "docker", "kubernetes", "aws", "gcp", "azure", "postgresql",
            "mysql", "mongodb", "redis", "elasticsearch", "typescript", "javascript", "react", "next.js",
            "vue", "angular", "tailwind css", "node.js", "python", "fastapi", "django", "git", "ci/cd"
    ));

    private ResumeTextExtractorUtil() {
        // Private constructor
    }

    /**
     * Extracts email address from resume text.
     *
     * @param resumeText Raw resume text.
     * @return Extracted email address or empty string.
     */
    public static String extractEmail(String resumeText) {
        if (resumeText == null) return "";
        Matcher matcher = EMAIL_PATTERN.matcher(resumeText);
        if (matcher.find()) {
            return matcher.group(0);
        }
        return "";
    }

    /**
     * Extracts phone number from resume text.
     *
     * @param resumeText Raw resume text.
     * @return Extracted phone string or empty string.
     */
    public static String extractPhone(String resumeText) {
        if (resumeText == null) return "";
        Matcher matcher = PHONE_PATTERN.matcher(resumeText);
        if (matcher.find()) {
            return matcher.group(0);
        }
        return "";
    }

    /**
     * Extracts total years of experience stated in candidate resume.
     *
     * @param resumeText Raw resume text.
     * @return Integer estimated years of experience or null if not detected.
     */
    public static Integer extractExperienceYears(String resumeText) {
        if (resumeText == null) return null;
        Matcher matcher = EXP_YEARS_PATTERN.matcher(resumeText);
        if (matcher.find()) {
            try {
                return Integer.parseInt(matcher.group(1));
            } catch (Exception e) {
                return null;
            }
        }
        return null;
    }

    /**
     * Extracts matching technical skills from catalog of enterprise competencies.
     *
     * @param resumeText Raw resume text.
     * @return List of detected skill tag strings.
     */
    public static List<String> extractSkills(String resumeText) {
        if (resumeText == null || resumeText.isBlank()) return new ArrayList<>();

        String lowerText = resumeText.toLowerCase();
        List<String> matched = new ArrayList<>();

        for (String skill : KNOWN_TECH_SKILLS) {
            if (lowerText.contains(skill)) {
                // Capitalize skill name nicely
                matched.add(capitalizeSkill(skill));
            }
        }

        return matched;
    }

    private static String capitalizeSkill(String skill) {
        if ("java".equals(skill)) return "Java";
        if ("spring boot".equals(skill)) return "Spring Boot";
        if ("rest api".equals(skill)) return "REST API";
        if ("aws".equals(skill)) return "AWS";
        if ("gcp".equals(skill)) return "GCP";
        if ("ci/cd".equals(skill)) return "CI/CD";
        return Arrays.stream(skill.split(" "))
                .map(w -> w.substring(0, 1).toUpperCase() + w.substring(1))
                .collect(Collectors.joining(" "));
    }
}
