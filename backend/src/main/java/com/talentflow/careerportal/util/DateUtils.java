package com.talentflow.careerportal.util;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.Date;

/**
 * Utility class providing static helper methods for date manipulation, ISO formatting,
 * relative time calculation (e.g. "2 days ago"), and timezone conversions.
 */
public final class DateUtils {

    public static final String DEFAULT_DATE_FORMAT = "yyyy-MM-dd";
    public static final String DEFAULT_DATETIME_FORMAT = "yyyy-MM-dd HH:mm:ss";
    public static final String ISO_DATETIME_FORMAT = "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'";

    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern(DEFAULT_DATE_FORMAT);
    private static final DateTimeFormatter DATETIME_FORMATTER = DateTimeFormatter.ofPattern(DEFAULT_DATETIME_FORMAT);

    private DateUtils() {
        // Private constructor to prevent instantiation
    }

    /**
     * Formats a LocalDate object into default YYYY-MM-DD string representation.
     *
     * @param date LocalDate to format.
     * @return Formatted date string or empty string if null.
     */
    public static String formatDate(LocalDate date) {
        if (date == null) return "";
        return date.format(DATE_FORMATTER);
    }

    /**
     * Formats a LocalDateTime object into default YYYY-MM-DD HH:mm:ss string representation.
     *
     * @param dateTime LocalDateTime to format.
     * @return Formatted datetime string or empty string if null.
     */
    public static String formatDateTime(LocalDateTime dateTime) {
        if (dateTime == null) return "";
        return dateTime.format(DATETIME_FORMATTER);
    }

    /**
     * Parses YYYY-MM-DD date string into a LocalDate object.
     *
     * @param dateStr Date string.
     * @return Parsed LocalDate or null if parsing fails.
     */
    public static LocalDate parseDate(String dateStr) {
        if (dateStr == null || dateStr.isBlank()) return null;
        try {
            return LocalDate.parse(dateStr.trim(), DATE_FORMATTER);
        } catch (Exception e) {
            return null;
        }
    }

    /**
     * Computes human-readable relative time string (e.g., "Just now", "5 minutes ago", "3 days ago").
     *
     * @param dateTime Past LocalDateTime instance.
     * @return Human-readable time ago string.
     */
    public static String formatRelativeTime(LocalDateTime dateTime) {
        if (dateTime == null) return "Unknown";

        LocalDateTime now = LocalDateTime.now();
        long seconds = ChronoUnit.SECONDS.between(dateTime, now);
        if (seconds < 60) return "Just now";

        long minutes = ChronoUnit.MINUTES.between(dateTime, now);
        if (minutes < 60) return minutes + (minutes == 1 ? " minute ago" : " minutes ago");

        long hours = ChronoUnit.HOURS.between(dateTime, now);
        if (hours < 24) return hours + (hours == 1 ? " hour ago" : " hours ago");

        long days = ChronoUnit.DAYS.between(dateTime, now);
        if (days < 30) return days + (days == 1 ? " day ago" : " days ago");

        long months = ChronoUnit.MONTHS.between(dateTime, now);
        if (months < 12) return months + (months == 1 ? " month ago" : " months ago");

        long years = ChronoUnit.YEARS.between(dateTime, now);
        return years + (years == 1 ? " year ago" : " years ago");
    }

    /**
     * Converts a java.util.Date to LocalDateTime using default system timezone.
     *
     * @param date Legacy Date instance.
     * @return LocalDateTime instance.
     */
    public static LocalDateTime toLocalDateTime(Date date) {
        if (date == null) return null;
        return date.toInstant().atZone(ZoneId.systemDefault()).toLocalDateTime();
    }

    /**
     * Converts LocalDateTime to java.util.Date using default system timezone.
     *
     * @param localDateTime LocalDateTime instance.
     * @return Legacy Date instance.
     */
    public static Date toDate(LocalDateTime localDateTime) {
        if (localDateTime == null) return null;
        return Date.from(localDateTime.atZone(ZoneId.systemDefault()).toInstant());
    }

    /**
     * Checks if a target date is within a specific range [startDate, endDate].
     *
     * @param target Date to test.
     * @param start Range start date.
     * @param end Range end date.
     * @return true if target is within range inclusive.
     */
    public static boolean isWithinRange(LocalDate target, LocalDate start, LocalDate end) {
        if (target == null) return false;
        boolean afterStart = (start == null) || !target.isBefore(start);
        boolean beforeEnd = (end == null) || !target.isAfter(end);
        return afterStart && beforeEnd;
    }
}
