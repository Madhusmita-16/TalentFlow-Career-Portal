package com.talentflow.careerportal.util;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.time.LocalDate;
import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Unit test suite for DateUtils formatting and parsing functions.
 */
public class DateUtilsTest {

    @Test
    @DisplayName("Should format LocalDate to YYYY-MM-DD string")
    void formatDate_Success() {
        LocalDate date = LocalDate.of(2026, 9, 25);
        String formatted = DateUtils.formatDate(date);
        assertEquals("2026-09-25", formatted);
    }

    @Test
    @DisplayName("Should parse valid date string")
    void parseDate_Success() {
        LocalDate parsed = DateUtils.parseDate("2026-09-25");
        assertNotNull(parsed);
        assertEquals(2026, parsed.getYear());
        assertEquals(9, parsed.getMonthValue());
        assertEquals(25, parsed.getDayOfMonth());
    }

    @Test
    @DisplayName("Should compute relative human readable time string")
    void formatRelativeTime_JustNow() {
        LocalDateTime now = LocalDateTime.now();
        String relative = DateUtils.formatRelativeTime(now);
        assertEquals("Just now", relative);
    }
}
