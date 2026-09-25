package com.talentflow.careerportal.util;

import com.talentflow.careerportal.dto.CandidateDto;
import com.talentflow.careerportal.dto.JobResponseDTO;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Utility for exporting candidate search results and job listings into CSV format.
 */
public final class CsvExporterUtil {

    private CsvExporterUtil() {
        // Private constructor
    }

    /**
     * Exports list of candidate DTOs to CSV string.
     *
     * @param candidates List of CandidateDto.
     * @return Formatted CSV text string.
     */
    public static String exportCandidatesToCsv(List<CandidateDto> candidates) {
        StringBuilder sb = new StringBuilder();
        sb.append("ID,Full Name,Email,Headline,Location,Completeness Score,Skills\n");

        if (candidates != null) {
            for (CandidateDto c : candidates) {
                sb.append(c.getId()).append(",");
                sb.append(escapeCsv(c.getFullName())).append(",");
                sb.append(escapeCsv(c.getEmail())).append(",");
                sb.append(escapeCsv(c.getHeadline())).append(",");
                sb.append(escapeCsv(c.getLocation())).append(",");
                sb.append(c.getProfileCompletionPercentage()).append(",");
                String skills = c.getSkills() != null ? String.join(" | ", c.getSkills()) : "";
                sb.append(escapeCsv(skills)).append("\n");
            }
        }

        return sb.toString();
    }

    /**
     * Exports list of job posting DTOs to CSV string.
     *
     * @param jobs List of JobResponseDTO.
     * @return Formatted CSV text string.
     */
    public static String exportJobsToCsv(List<JobResponseDTO> jobs) {
        StringBuilder sb = new StringBuilder();
        sb.append("ID,Title,Organization,Location,Job Type,Salary Min,Salary Max,Posted At,Applications Count\n");

        if (jobs != null) {
            for (JobResponseDTO j : jobs) {
                sb.append(j.getId()).append(",");
                sb.append(escapeCsv(j.getTitle())).append(",");
                sb.append(escapeCsv(j.getOrganizationName())).append(",");
                sb.append(escapeCsv(j.getLocation())).append(",");
                sb.append(escapeCsv(j.getJobType())).append(",");
                sb.append(j.getSalaryMin() != null ? j.getSalaryMin() : "").append(",");
                sb.append(j.getSalaryMax() != null ? j.getSalaryMax() : "").append(",");
                sb.append(j.getPostedAt() != null ? j.getPostedAt() : "").append(",");
                sb.append(j.getApplicationsCount()).append("\n");
            }
        }

        return sb.toString();
    }

    private static String escapeCsv(String input) {
        if (input == null) return "\"\"";
        String escaped = input.replace("\"", "\"\"");
        return "\"" + escaped + "\"";
    }
}
