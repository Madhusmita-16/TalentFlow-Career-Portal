package com.talentflow.careerportal.service;

import com.talentflow.careerportal.dto.PagedResponse;
import com.talentflow.careerportal.entity.AuditLog;

import java.time.LocalDateTime;

/**
 * Service interface for enterprise compliance audit logging, event tracking,
 * security monitoring, and administrator access history.
 */
public interface AuditService {

    /**
     * Logs a platform security or operational event.
     *
     * @param userId Associated User ID (or null for anonymous system events).
     * @param eventType Category string (e.g., USER_LOGIN_SUCCESS, APPLICATION_SUBMITTED).
     * @param description Detailed event message.
     * @param module Originating service or module name.
     */
    void logEvent(Long userId, String eventType, String description, String module);

    /**
     * Logs a detailed event with IP address and user agent metadata.
     *
     * @param userId Associated User ID.
     * @param eventType Category string.
     * @param description Detailed event message.
     * @param module Originating service/module.
     * @param ipAddress Client IP address.
     * @param userAgent Client browser/device User-Agent string.
     */
    void logEventWithContext(Long userId, String eventType, String description, String module, String ipAddress, String userAgent);

    /**
     * Retrieves paged compliance audit logs.
     *
     * @param page Page index.
     * @param size Page size.
     * @return PagedResponse of AuditLog entities.
     */
    PagedResponse<AuditLog> getAuditLogs(int page, int size);

    /**
     * Retrieves audit logs filtered by specific user ID.
     *
     * @param userId Target User ID.
     * @param page Page index.
     * @param size Page size.
     * @return PagedResponse of AuditLog entities.
     */
    PagedResponse<AuditLog> getAuditLogsByUser(Long userId, int page, int size);
}
