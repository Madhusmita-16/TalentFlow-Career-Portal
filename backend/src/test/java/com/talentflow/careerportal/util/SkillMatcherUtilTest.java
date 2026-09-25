package com.talentflow.careerportal.util;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Unit test suite for SkillMatcherUtil algorithms.
 */
public class SkillMatcherUtilTest {

    @Test
    @DisplayName("Should return 100.0 percentage when candidate possesses all required skills")
    void calculateMatchPercentage_PerfectMatch() {
        List<String> candidateSkills = List.of("Java", "Spring Boot", "Docker");
        List<String> requiredSkills = List.of("java", "spring boot");

        double percentage = SkillMatcherUtil.calculateMatchPercentage(candidateSkills, requiredSkills);
        assertEquals(100.0, percentage);
    }

    @Test
    @DisplayName("Should identify missing skills accurately")
    void findMissingSkills_Accurate() {
        List<String> candidateSkills = List.of("Java", "Spring Boot");
        List<String> requiredSkills = List.of("Java", "Spring Boot", "Kafka", "Kubernetes");

        List<String> missing = SkillMatcherUtil.findMissingSkills(candidateSkills, requiredSkills);
        assertEquals(2, missing.size());
        assertTrue(missing.contains("Kafka"));
        assertTrue(missing.contains("Kubernetes"));
    }
}
