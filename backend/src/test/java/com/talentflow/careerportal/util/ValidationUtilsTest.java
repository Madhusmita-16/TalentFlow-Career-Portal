package com.talentflow.careerportal.util;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Unit test suite for ValidationUtils regex matching.
 */
public class ValidationUtilsTest {

    @Test
    @DisplayName("Should validate valid email address")
    void isValidEmail_Valid() {
        assertTrue(ValidationUtils.isValidEmail("user@example.com"));
        assertTrue(ValidationUtils.isValidEmail("alex.morgan@domain.co.uk"));
    }

    @Test
    @DisplayName("Should reject invalid email address")
    void isValidEmail_Invalid() {
        assertFalse(ValidationUtils.isValidEmail("invalid-email"));
        assertFalse(ValidationUtils.isValidEmail("user@.com"));
    }

    @Test
    @DisplayName("Should validate strong password rules")
    void isStrongPassword_Validation() {
        assertTrue(ValidationUtils.isStrongPassword("Password123!"));
        assertFalse(ValidationUtils.isStrongPassword("weak"));
    }
}
