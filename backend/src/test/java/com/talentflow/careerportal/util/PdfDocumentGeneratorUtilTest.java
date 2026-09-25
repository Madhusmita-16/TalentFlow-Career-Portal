package com.talentflow.careerportal.util;

import com.talentflow.careerportal.dto.CandidateProfileDTO;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Unit test suite for PdfDocumentGeneratorUtil.
 */
public class PdfDocumentGeneratorUtilTest {

    @Test
    @DisplayName("Should generate valid HTML resume string containing candidate details")
    void generateResumeHtml_Success() {
        CandidateProfileDTO candidate = new CandidateProfileDTO();
        candidate.setFullName("Alex Morgan");
        candidate.setHeadline("Senior Full Stack Architect");
        candidate.setEmail("alex.morgan@example.com");
        candidate.setSkills(List.of("Java", "Spring Boot", "TypeScript"));

        String html = PdfDocumentGeneratorUtil.generateResumeHtml(candidate);

        assertNotNull(html);
        assertTrue(html.contains("Alex Morgan"));
        assertTrue(html.contains("Senior Full Stack Architect"));
        assertTrue(html.contains("Java"));
    }
}
