package com.talentflow.careerportal.util;

import java.util.regex.Pattern;

/**
 * Text processing utility for sanitizing user-submitted HTML, removing dangerous tags,
 * normalizing whitespace, and extracting keywords from resumes or job descriptions.
 */
public final class TextSanitizer {

    private static final Pattern SCRIPT_TAG_PATTERN = Pattern.compile("<script[\\s\\S]*?>[\\s\\S]*?</script>", Pattern.CASE_INSENSITIVE);
    private static final Pattern HTML_TAG_PATTERN = Pattern.compile("<[^>]*>");
    private static final Pattern MULTI_SPACE_PATTERN = Pattern.compile("\\s+");

    private TextSanitizer() {
        // Private constructor
    }

    /**
     * Strips all HTML tags and script elements from target text string.
     *
     * @param input Raw HTML string.
     * @return Clean plain-text string.
     */
    public static String stripHtml(String input) {
        if (input == null || input.isBlank()) return "";
        String clean = SCRIPT_TAG_PATTERN.matcher(input).replaceAll("");
        clean = HTML_TAG_PATTERN.matcher(clean).replaceAll("");
        clean = MULTI_SPACE_PATTERN.matcher(clean).replaceAll(" ");
        return clean.trim();
    }

    /**
     * Normalizes text whitespace, replaces tabs and line breaks with single spaces.
     *
     * @param text Target text string.
     * @return Normalized string.
     */
    public static String normalizeWhitespace(String text) {
        if (text == null) return "";
        return MULTI_SPACE_PATTERN.matcher(text).replaceAll(" ").trim();
    }

    /**
     * Truncates text string cleanly to maximum length without breaking words.
     *
     * @param text Target string.
     * @param maxLength Maximum allowed length.
     * @return Truncated text with ellipsis if shortened.
     */
    public static String truncateCleanly(String text, int maxLength) {
        if (text == null || text.length() <= maxLength) return text;
        int lastSpace = text.lastIndexOf(' ', maxLength);
        if (lastSpace <= 0) lastSpace = maxLength;
        return text.substring(0, lastSpace) + "...";
    }

    /**
     * Sanitizes user input string by escaping special character entities.
     *
     * @param input User input string.
     * @return Escaped safe string.
     */
    public static String escapeHtmlEntities(String input) {
        if (input == null) return "";
        return input.replace("&", "&amp;")
                .replace("<", "&lt;")
                .replace(">", "&gt;")
                .replace("\"", "&quot;")
                .replace("'", "&#39;");
    }
}
