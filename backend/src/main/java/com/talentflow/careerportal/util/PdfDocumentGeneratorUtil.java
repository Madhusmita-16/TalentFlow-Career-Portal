package com.talentflow.careerportal.util;

import com.talentflow.careerportal.dto.CandidateProfileDTO;
import com.talentflow.careerportal.dto.WorkExperienceDto;
import com.talentflow.careerportal.dto.EducationDto;

import java.io.ByteArrayOutputStream;
import java.nio.charset.StandardCharsets;

/**
 * Utility for formatting candidate profiles into standardized PDF/HTML resume documents
 * for recruiter export and candidate offline downloads.
 */
public final class PdfDocumentGeneratorUtil {

    private PdfDocumentGeneratorUtil() {
        // Private constructor
    }

    /**
     * Generates a clean HTML representation of candidate profile for PDF rendering engines.
     *
     * @param candidate Candidate profile payload.
     * @return HTML document content string.
     */
    public static String generateResumeHtml(CandidateProfileDTO candidate) {
        if (candidate == null) return "<html><body><h1>No Candidate Profile</h1></body></html>";

        StringBuilder sb = new StringBuilder();
        sb.append("<!DOCTYPE html><html><head><style>");
        sb.append("body { font-family: 'Helvetica Neue', Arial, sans-serif; color: #1e293b; margin: 40px; }");
        sb.append("h1 { color: #0284c7; font-size: 24px; margin-bottom: 4px; }");
        sb.append("h2 { color: #334155; font-size: 16px; border-bottom: 2px solid #e2e8f0; padding-bottom: 4px; margin-top: 24px; }");
        sb.append(".headline { font-size: 14px; color: #64748b; font-weight: 500; }");
        sb.append(".contact { font-size: 12px; color: #475569; margin-top: 8px; }");
        sb.append(".skill-pill { display: inline-block; background: #e0f2fe; color: #0369a1; padding: 4px 10px; border-radius: 12px; font-size: 11px; font-weight: 600; margin-right: 6px; margin-bottom: 6px; }");
        sb.append(".item-title { font-weight: bold; font-size: 13px; }");
        sb.append(".item-sub { color: #64748b; font-size: 12px; }");
        sb.append("</style></head><body>");

        sb.append("<h1>").append(escape(candidate.getFullName())).append("</h1>");
        sb.append("<div class='headline'>").append(escape(candidate.getHeadline())).append("</div>");
        sb.append("<div class='contact'>Email: ").append(escape(candidate.getEmail()));
        if (candidate.getPhone() != null && !candidate.getPhone().isBlank()) {
            sb.append(" | Phone: ").append(escape(candidate.getPhone()));
        }
        if (candidate.getLocation() != null && !candidate.getLocation().isBlank()) {
            sb.append(" | Location: ").append(escape(candidate.getLocation()));
        }
        sb.append("</div>");

        if (candidate.getBio() != null && !candidate.getBio().isBlank()) {
            sb.append("<h2>Professional Summary</h2>");
            sb.append("<p style='font-size:12px; line-height:1.5;'>").append(escape(candidate.getBio())).append("</p>");
        }

        if (candidate.getSkills() != null && !candidate.getSkills().isEmpty()) {
            sb.append("<h2>Technical Core Competencies</h2><div>");
            for (String skill : candidate.getSkills()) {
                sb.append("<span class='skill-pill'>").append(escape(skill)).append("</span>");
            }
            sb.append("</div>");
        }

        if (candidate.getExperiences() != null && !candidate.getExperiences().isEmpty()) {
            sb.append("<h2>Work Experience</h2>");
            for (WorkExperienceDto exp : candidate.getExperiences()) {
                sb.append("<div style='margin-bottom: 12px;'>");
                sb.append("<div class='item-title'>").append(escape(exp.getPosition())).append(" &mdash; ").append(escape(exp.getCompany())).append("</div>");
                sb.append("<div class='item-sub'>").append(exp.getStartDate() != null ? exp.getStartDate() : "").append(" - ").append(exp.getIsCurrent() != null && exp.getIsCurrent() ? "Present" : (exp.getEndDate() != null ? exp.getEndDate() : "")).append("</div>");
                if (exp.getDescription() != null && !exp.getDescription().isBlank()) {
                    sb.append("<p style='font-size:12px; margin-top:4px;'>").append(escape(exp.getDescription())).append("</p>");
                }
                sb.append("</div>");
            }
        }

        if (candidate.getEducationList() != null && !candidate.getEducationList().isEmpty()) {
            sb.append("<h2>Education</h2>");
            for (EducationDto edu : candidate.getEducationList()) {
                sb.append("<div style='margin-bottom: 8px;'>");
                sb.append("<div class='item-title'>").append(escape(edu.getDegree())).append(" in ").append(escape(edu.getFieldOfStudy())).append("</div>");
                sb.append("<div class='item-sub'>").append(escape(edu.getInstitution())).append("</div>");
                sb.append("</div>");
            }
        }

        sb.append("</body></html>");
        return sb.toString();
    }

    private static String escape(String text) {
        return TextSanitizer.escapeHtmlEntities(text);
    }
}
