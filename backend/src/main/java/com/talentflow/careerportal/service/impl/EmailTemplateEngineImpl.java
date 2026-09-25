package com.talentflow.careerportal.service.impl;

import com.talentflow.careerportal.service.EmailTemplateEngine;
import org.springframework.stereotype.Service;

import java.util.Map;

/**
 * Enterprise implementation of EmailTemplateEngine.
 */
@Service
public class EmailTemplateEngineImpl implements EmailTemplateEngine {

    @Override
    public String renderTemplate(String templateName, Map<String, Object> variables) {
        String recipientName = variables != null && variables.containsKey("recipientName") ?
                variables.get("recipientName").toString() : "Candidate";

        StringBuilder sb = new StringBuilder();
        sb.append("<!DOCTYPE html><html><body style='font-family: Arial, sans-serif; background-color: #f8fafc; padding: 20px;'>");
        sb.append("<div style='max-width: 600px; margin: 0 auto; background: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.05);'>");
        sb.append("<h2 style='color: #0284c7;'>Link2Career &mdash; Notification</h2>");
        sb.append("<p>Dear ").append(recipientName).append(",</p>");

        if ("welcome".equalsIgnoreCase(templateName)) {
            sb.append("<p>Welcome to <strong>Link2Career &mdash; Your Professional Network & Career Platform</strong>! We are thrilled to help accelerate your career progression.</p>");
        } else if ("interview_invite".equalsIgnoreCase(templateName)) {
            sb.append("<p>You have been invited for a technical interview! Please check your candidate portal dashboard for meeting link details.</p>");
        } else {
            sb.append("<p>You have a new alert notification on your Link2Career account dashboard.</p>");
        }

        sb.append("<hr style='border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;'>");
        sb.append("<p style='font-size: 12px; color: #64748b;'>Link2Career Platform &copy; 2026. All rights reserved.</p>");
        sb.append("</div></body></html>");

        return sb.toString();
    }
}
