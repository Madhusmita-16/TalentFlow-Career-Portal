package com.talentflow.careerportal.util;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Unit test suite for ResumeTextExtractorUtil resume parsing.
 */
public class ResumeTextExtractorUtilTest {

    @Test
    @DisplayName("Should extract candidate email from resume text")
    void extractEmail_Success() {
        String resume = "Alex Morgan\nEmail: alex.morgan@example.com\nPhone: +1 555-0199";
        String email = ResumeTextExtractorUtil.extractEmail(resume);
        assertEquals("alex.morgan@example.com", email);
    }

    @Test
    @DisplayName("Should extract tech skills from resume text")
    void extractSkills_Success() {
        String resume = "Experienced Engineer proficient in Java, Spring Boot, React, AWS, and Docker.";
        List<String> skills = ResumeTextExtractorUtil.extractSkills(resume);

        assertNotNull(skills);
        assertTrue(skills.contains("Java"));
        assertTrue(skills.contains("Spring Boot"));
        assertTrue(skills.contains("React"));
        assertTrue(skills.contains("AWS"));
    }
}
