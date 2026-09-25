package com.talentflow.careerportal.util;

import com.talentflow.careerportal.dto.CandidateDto;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Unit test suite for CsvExporterUtil.
 */
public class CsvExporterUtilTest {

    @Test
    @DisplayName("Should export candidates list to valid CSV string format")
    void exportCandidatesToCsv_Success() {
        CandidateDto dto = new CandidateDto();
        dto.setId(10L);
        dto.setFullName("Jordan Lee");
        dto.setEmail("jordan@example.com");
        dto.setHeadline("Software Engineer");
        dto.setProfileCompletionPercentage(90);
        dto.setSkills(List.of("Java", "React"));

        String csv = CsvExporterUtil.exportCandidatesToCsv(List.of(dto));

        assertNotNull(csv);
        assertTrue(csv.contains("ID,Full Name,Email"));
        assertTrue(csv.contains("Jordan Lee"));
        assertTrue(csv.contains("jordan@example.com"));
    }
}
