package com.talentflow.careerportal.util;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Unit test suite for AtsScorerUtil weighted scoring and keyword extraction.
 */
public class AtsScorerUtilTest {

    @Test
    @DisplayName("Should compute weighted score combining skill match and experience years")
    void calculateComprehensiveAtsScore_WeightedMatch() {
        List<String> candidateSkills = List.of("Java", "Spring Boot", "React");
        List<String> requiredSkills = List.of("Java", "Spring Boot", "React", "AWS"); // 75% skill match

        // Candidate has 5 years exp, required is 5 years (100% exp match)
        // Score = (75 * 0.70) + (100 * 0.30) = 52.5 + 30 = 82.5 -> 83
        int score = AtsScorerUtil.calculateComprehensiveAtsScore(candidateSkills, requiredSkills, 5, 5);
        assertEquals(83, score);
    }
}
