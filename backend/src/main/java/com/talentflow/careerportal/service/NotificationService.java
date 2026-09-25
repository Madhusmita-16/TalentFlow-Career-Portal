package com.talentflow.careerportal.service;

import com.talentflow.careerportal.dto.NotificationDto;
import com.talentflow.careerportal.dto.PagedResponse;

import java.util.List;

/**
 * Service interface for candidate & recruiter notification dispatching,
 * in-app alert tracking, read state management, and push notification triggers.
 */
public interface NotificationService {

    /**
     * Sends an in-app notification to target user.
     *
     * @param userId Target User ID.
     * @param title Alert title.
     * @param message Detailed notification text.
     * @param type Notification category (e.g. APPLICATION_UPDATE, INTERVIEW_INVITE, SYSTEM).
     * @return NotificationDto created notification payload.
     */
    NotificationDto sendNotification(Long userId, String title, String message, String type);

    /**
     * Retrieves paged notifications for a user.
     *
     * @param userId Target User ID.
     * @param unreadOnly Filter by unread status only.
     * @param page Page index.
     * @param size Page size limit.
     * @return PagedResponse of NotificationDto items.
     */
    PagedResponse<NotificationDto> getUserNotifications(Long userId, boolean unreadOnly, int page, int size);

    /**
     * Marks a specific notification as read.
     *
     * @param userId Target User ID.
     * @param notificationId Notification entity ID.
     */
    void markAsRead(Long userId, Long notificationId);

    /**
     * Marks all notifications for a user as read.
     *
     * @param userId Target User ID.
     */
    void markAllAsRead(Long userId);

    /**
     * Counts unread notifications for user badge indicator.
     *
     * @param userId Target User ID.
     * @return Count of unread alerts.
     */
    long countUnreadNotifications(Long userId);
}
