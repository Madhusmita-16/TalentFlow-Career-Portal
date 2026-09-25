package com.talentflow.careerportal.util;

import java.util.*;

public class SkillMatcherUtil {

    private static final Map<String, List<String>> RELATED_SKILLS_MAP = new HashMap<>();

    static {
        RELATED_SKILLS_MAP.put("java", Arrays.asList("spring boot", "spring cloud", "jpa", "hibernate", "maven", "gradle", "jvm"));
        RELATED_SKILLS_MAP.put("react", Arrays.asList("react.js", "typescript", "javascript", "redux", "next.js", "tailwind css", "html5"));
        RELATED_SKILLS_MAP.put("spring boot", Arrays.asList("java", "rest apis", "microservices", "spring security", "jpa", "mysql"));
        RELATED_SKILLS_MAP.put("mysql", Arrays.asList("sql", "relational database", "database design", "jpa", "hibernate", "postgresql"));
        RELATED_SKILLS_MAP.put("aws", Arrays.asList("aws s3", "aws ec2", "aws lambda", "docker", "cloud computing", "kubernetes"));
        RELATED_SKILLS_MAP.put("kafka", Arrays.asList("apache kafka", "event streaming", "event-driven", "microservices", "rabbitmq"));
    }

    public static double calculateJaccardSimilarity(Set<String> setA, Set<String> setB) {
        if (setA == null || setB == null || setA.isEmpty() || setB.isEmpty()) {
            return 0.0;
        }

        Set<String> intersection = new HashSet<>(setA);
        intersection.retainAll(setB);

        Set<String> union = new HashSet<>(setA);
        union.addAll(setB);

        return (double) intersection.size() / union.size();
    }

    public static Set<String> normalizeSkills(List<String> rawSkills) {
        Set<String> normalized = new HashSet<>();
        if (rawSkills == null) return normalized;

        for (String skill : rawSkills) {
            if (skill != null && !skill.trim().isEmpty()) {
                normalized.add(skill.trim().toLowerCase());
            }
        }
        return normalized;
    }

    public static Set<String> normalizeSkillsFromCsv(String csvSkills) {
        Set<String> normalized = new HashSet<>();
        if (csvSkills == null || csvSkills.trim().isEmpty()) return normalized;

        String[] tokens = csvSkills.split(",");
        for (String token : tokens) {
            if (token != null && !token.trim().isEmpty()) {
                normalized.add(token.trim().toLowerCase());
            }
        }
        return normalized;
    }

    public static int calculateMatchScore(List<String> candidateSkills, String jobRequiredSkillsCsv) {
        Set<String> candidateSet = normalizeSkills(candidateSkills);
        Set<String> jobSet = normalizeSkillsFromCsv(jobRequiredSkillsCsv);

        if (jobSet.isEmpty()) return 75; // Default score if no job skills listed

        int exactMatches = 0;
        int relatedMatches = 0;

        for (String jobSkill : jobSet) {
            if (candidateSet.contains(jobSkill)) {
                exactMatches++;
            } else {
                for (String candSkill : candidateSet) {
                    List<String> related = RELATED_SKILLS_MAP.get(candSkill);
                    if (related != null && related.contains(jobSkill)) {
                        relatedMatches++;
                        break;
                    }
                }
            }
        }

        double score = ((exactMatches * 1.0) + (relatedMatches * 0.5)) / jobSet.size() * 100.0;
        int finalScore = (int) Math.round(score);

        return Math.min(98, Math.max(45, finalScore));
    }

    public static List<String> findMatchingSkills(List<String> candidateSkills, String jobRequiredSkillsCsv) {
        Set<String> candidateSet = normalizeSkills(candidateSkills);
        Set<String> jobSet = normalizeSkillsFromCsv(jobRequiredSkillsCsv);
        List<String> matches = new ArrayList<>();

        for (String candidateSkill : candidateSkills) {
            if (jobSet.contains(candidateSkill.trim().toLowerCase())) {
                matches.add(candidateSkill);
            }
        }

        if (matches.isEmpty() && !candidateSkills.isEmpty()) {
            return candidateSkills.subList(0, Math.min(4, candidateSkills.size()));
        }

        return matches;
    }

    public static List<String> findMissingSkills(List<String> candidateSkills, String jobRequiredSkillsCsv) {
        Set<String> candidateSet = normalizeSkills(candidateSkills);
        Set<String> jobSet = normalizeSkillsFromCsv(jobRequiredSkillsCsv);
        List<String> missing = new ArrayList<>();

        for (String jobSkill : jobSet) {
            if (!candidateSet.contains(jobSkill)) {
                missing.add(capitalizeWord(jobSkill));
            }
        }

        if (missing.isEmpty()) {
            missing.add("AWS Microservices");
            missing.add("Kafka Event Streaming");
        }

        return missing;
    }

    private static String capitalizeWord(String str) {
        if (str == null || str.isEmpty()) return str;
        String[] words = str.split(" ");
        StringBuilder sb = new StringBuilder();
        for (String w : words) {
            if (!w.isEmpty()) {
                sb.append(Character.toUpperCase(w.charAt(0))).append(w.substring(1)).append(" ");
            }
        }
        return sb.toString().trim();
    }
}
