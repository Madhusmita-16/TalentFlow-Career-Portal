package com.talentflow.careerportal.util;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Unit test suite for TextSanitizer HTML stripping and escaping.
 */
public class TextSanitizerTest {

    @Test
    @DisplayName("Should strip HTML tags from input string")
    void stripHtml_Success() {
        String input = "<p>Hello <b>World</b>!</p>";
        String clean = TextSanitizer.stripHtml(input);
        assertEquals("Hello World !", clean);
    }

    @Test
    @DisplayName("Should remove dangerous script tags")
    void stripHtml_ScriptRemoval() {
        String input = "Text <script>alert('xss')</script> Content";
        String clean = TextSanitizer.stripHtml(input);
        assertEquals("Text Content", clean);
    }
}
