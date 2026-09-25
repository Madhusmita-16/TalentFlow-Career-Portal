package com.talentflow.careerportal.service.impl;

import com.talentflow.careerportal.dto.NotificationDto;
import com.talentflow.careerportal.dto.PagedResponse;
import com.talentflow.careerportal.entity.Notification;
import com.talentflow.careerportal.entity.User;
import com.talentflow.careerportal.exception.ResourceNotFoundException;
import com.talentflow.careerportal.repository.NotificationRepository;
import com.talentflow.careerportal.repository.UserRepository;
import com.talentflow.careerportal.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Enterprise implementation of NotificationService.
 */
@Service
@Transactional
public class NotificationServiceImpl implements NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

    @Autowired
    public NotificationServiceImpl(NotificationRepository notificationRepository, UserRepository userRepository) {
        this.notificationRepository = notificationRepository;
        this.userRepository = userRepository;
    }

    @Override
    public NotificationDto sendNotification(Long userId, String title, String message, String type) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        Notification notif = new Notification();
        notif.setUser(user);
        notif.setTitle(title);
        notif.setMessage(message);
        notif.setType(type != null ? type : "SYSTEM");
        notif.setRead(false);
        notif.setCreatedAt(LocalDateTime.now());

        Notification saved = notificationRepository.save(notif);
        return mapToDto(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public PagedResponse<NotificationDto> getUserNotifications(Long userId, boolean unreadOnly, int page, int size) {
        Pageable pageable = PageRequest.of(page < 0 ? 0 : page, size <= 0 ? 10 : size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<Notification> notifPage = notificationRepository.findByUserId(userId, pageable);

        List<NotificationDto> dtos = notifPage.getContent().stream()
                .filter(n -> !unreadOnly || !n.isRead())
                .map(this::mapToDto)
                .collect(Collectors.toList());

        return new PagedResponse<>(dtos, notifPage.getNumber(), notifPage.getSize(), notifPage.getTotalElements(), notifPage.getTotalPages(), notifPage.isLast());
    }

    @Override
    public void markAsRead(Long userId, Long notificationId) {
        Notification notif = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new ResourceNotFoundException("Notification", "id", notificationId));

        if (notif.getUser() != null && notif.getUser().getId().equals(userId)) {
            notif.setRead(true);
            notificationRepository.save(notif);
        }
    }

    @Override
    public void markAllAsRead(Long userId) {
        List<Notification> unread = notificationRepository.findByUserIdAndReadFalse(userId);
        for (Notification n : unread) {
            n.setRead(true);
        }
        notificationRepository.saveAll(unread);
    }

    @Override
    @Transactional(readOnly = true)
    public long countUnreadNotifications(Long userId) {
        return notificationRepository.countByUserIdAndReadFalse(userId);
    }

    private NotificationDto mapToDto(Notification notif) {
        NotificationDto dto = new NotificationDto();
        dto.setId(notif.getId());
        dto.setTitle(notif.getTitle());
        dto.setMessage(notif.getMessage());
        dto.setType(notif.getType());
        dto.setRead(notif.isRead());
        dto.setCreatedAt(notif.getCreatedAt());
        return dto;
    }
}
