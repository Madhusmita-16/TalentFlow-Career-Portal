package com.talentflow.careerportal.service;

import java.util.Map;

/**
 * Service interface for rendering transactional HTML emails for welcome onboarding,
 * job application confirmations, interview invitations, and recruiter alerts.
 */
public interface EmailTemplateEngine {

    /**
     * Renders a transactional email template into HTML body string.
     *
     * @param templateName Name of template (e.g. "welcome", "application_received", "interview_invite").
     * @param variables Model variables map.
     * @return Rendered HTML string body.
     */
    String renderTemplate(String templateName, Map<String, Object> variables);
}
