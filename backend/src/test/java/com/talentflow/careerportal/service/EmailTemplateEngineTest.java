package com.talentflow.careerportal.service;

import com.talentflow.careerportal.service.impl.EmailTemplateEngineImpl;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Unit test suite for EmailTemplateEngineImpl HTML email rendering.
 */
public class EmailTemplateEngineTest {

    private final EmailTemplateEngine templateEngine = new EmailTemplateEngineImpl();

    @Test
    @DisplayName("Should render welcome email template with candidate recipient name")
    void renderTemplate_Welcome() {
        Map<String, Object> vars = Map.of("recipientName", "Taylor Swift");
        String html = templateEngine.renderTemplate("welcome", vars);

        assertNotNull(html);
        assertTrue(html.contains("Taylor Swift"));
        assertTrue(html.contains("Link2Career"));
    }
}
