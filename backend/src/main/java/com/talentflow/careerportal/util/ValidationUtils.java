package com.talentflow.careerportal.util;

import java.util.regex.Pattern;

/**
 * Enterprise validation utility providing regex matching for emails, phone numbers,
 * URLs, passwords, and sanitization checks across user payloads.
 */
public final class ValidationUtils {

    private static final Pattern EMAIL_PATTERN = Pattern.compile(
            "^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,6}$"
    );

    private static final Pattern PHONE_PATTERN = Pattern.compile(
            "^\\+?[0-9]{1,4}?[-. ]?\\(?([0-9]{1,3})\\)?[-. ]?([0-9]{1,4})[-. ]?([0-9]{1,9})$"
    );

    private static final Pattern URL_PATTERN = Pattern.compile(
            "^(https?|ftp)://[-a-zA-Z0-9+&@#/%?=~_|!:,.;]*[-a-zA-Z0-9+&@#/%=~_|]"
    );

    private ValidationUtils() {
        // Private constructor
    }

    /**
     * Validates email address syntax against RFC standards.
     *
     * @param email Target email address string.
     * @return true if valid, false otherwise.
     */
    public static boolean isValidEmail(String email) {
        if (email == null || email.isBlank()) return false;
        return EMAIL_PATTERN.matcher(email.trim()).matches();
    }

    /**
     * Validates phone number format (supports international formats).
     *
     * @param phone Target phone string.
     * @return true if valid, false otherwise.
     */
    public static boolean isValidPhone(String phone) {
        if (phone == null || phone.isBlank()) return false;
        return PHONE_PATTERN.matcher(phone.trim()).matches();
    }

    /**
     * Validates URL web address format.
     *
     * @param url Target URL string.
     * @return true if valid HTTP/HTTPS URL, false otherwise.
     */
    public static boolean isValidUrl(String url) {
        if (url == null || url.isBlank()) return false;
        return URL_PATTERN.matcher(url.trim()).matches();
    }

    /**
     * Evaluates password strength criteria (min 8 chars, 1 uppercase, 1 digit, 1 special char).
     *
     * @param password Password string.
     * @return true if strong password rules pass.
     */
    public static boolean isStrongPassword(String password) {
        if (password == null || password.length() < 8) return false;
        boolean hasUpper = false;
        boolean hasDigit = false;
        boolean hasSpecial = false;

        for (char c : password.toCharArray()) {
            if (Character.isUpperCase(c)) hasUpper = true;
            else if (Character.isDigit(c)) hasDigit = true;
            else if (!Character.isLetterOrDigit(c)) hasSpecial = true;
        }

        return hasUpper && hasDigit && hasSpecial;
    }

    /**
     * Checks if text contains suspicious HTML/script tags (XSS check).
     *
     * @param input Raw string input.
     * @return true if potentially dangerous script elements detected.
     */
    public static boolean containsUnsafeHtml(String input) {
        if (input == null) return false;
        String lower = input.toLowerCase();
        return lower.contains("<script>") || lower.contains("javascript:") || lower.contains("onload=") || lower.contains("onerror=");
    }
}
